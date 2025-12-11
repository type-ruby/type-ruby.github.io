/**
 * T-Ruby WASM Loader for Playground
 *
 * Uses a Web Worker to isolate WASM execution from browser extensions.
 * Web Workers run in a separate thread and extensions don't inject content scripts into them.
 */

// Types
export interface CompileResult {
  success: boolean;
  ruby: string;
  rbs: string;
  errors: string[];
}

export interface TRubyCompiler {
  compile(code: string): Promise<CompileResult>;
  healthCheck(): { loaded: boolean; version: string; ruby_version: string };
  getVersion(): { t_ruby: string; ruby: string };
}

export type LoadingState = 'idle' | 'loading' | 'ready' | 'error';

export interface LoadingProgress {
  state: LoadingState;
  message: string;
  progress?: number; // 0-100
}

// Singleton state
let compiler: TRubyCompiler | null = null;
let loadingPromise: Promise<TRubyCompiler> | null = null;
let wasmWorker: Worker | null = null;
let healthData: { loaded: boolean; version: string; ruby_version: string } | null = null;

// Pending compile requests
const pendingRequests = new Map<string, {
  resolve: (result: CompileResult) => void;
  reject: (error: Error) => void;
}>();

let requestIdCounter = 0;

function generateRequestId(): string {
  return `req_${++requestIdCounter}_${Date.now()}`;
}

// T-Ruby WASM package version - update this when publishing new version
const T_RUBY_WASM_VERSION = '0.0.8';

// T-Ruby library CDN base URL
const T_RUBY_CDN_BASE = `https://cdn.jsdelivr.net/npm/@t-ruby/wasm@${T_RUBY_WASM_VERSION}/dist/lib/`;

// T-Ruby library files in dependency order (only core compilation files)
// Excluded: lsp_server, watcher, cli, cache, package_manager, bundler_integration, benchmark, doc_generator
// These require external gems (listen, etc.) not available in WASM
const T_RUBY_FILES = [
  't_ruby/version.rb',
  't_ruby/config.rb',
  't_ruby/ir.rb',
  't_ruby/parser_combinator.rb',
  't_ruby/smt_solver.rb',
  't_ruby/type_alias_registry.rb',
  't_ruby/parser.rb',
  't_ruby/union_type_parser.rb',
  't_ruby/generic_type_parser.rb',
  't_ruby/intersection_type_parser.rb',
  't_ruby/type_erasure.rb',
  't_ruby/error_handler.rb',
  't_ruby/rbs_generator.rb',
  't_ruby/declaration_generator.rb',
  't_ruby/compiler.rb',
  't_ruby/constraint_checker.rb',
  't_ruby/type_inferencer.rb',
  't_ruby/runtime_validator.rb',
  't_ruby/type_checker.rb',
];

// Web Worker code as a string - runs in isolated thread
const WORKER_CODE = `
// Web Worker for T-Ruby WASM compilation
// This runs in a separate thread, isolated from browser extensions

// Use @ruby/wasm-wasi package directly for DefaultRubyVM
const RUBY_WASM_CDN = 'https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.1/dist/browser/+esm';
// Use Ruby 3.4 WASM binary (more stable)
const RUBY_WASM_BINARY = 'https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.7.1/dist/ruby+stdlib.wasm';

// T-Ruby library CDN base URL
const T_RUBY_LIB_BASE = '${T_RUBY_CDN_BASE}';

// T-Ruby library files in dependency order
const T_RUBY_FILES = ${JSON.stringify(T_RUBY_FILES)};

const BOOTSTRAP_CODE = \`
require "json"

# Define TRuby module if not already defined
module TRuby
end unless defined?(TRuby)

$trb_compiler = nil

def get_compiler
  $trb_compiler ||= TRuby::Compiler.new(nil, use_ir: true, optimize: false)
end

def __trb_compile__(code)
  compiler = get_compiler

  begin
    result = compiler.compile_string(code)

    {
      success: result[:errors].empty?,
      ruby: result[:ruby] || "",
      rbs: result[:rbs] || "",
      errors: result[:errors] || []
    }.to_json
  rescue TRuby::ParseError => e
    {
      success: false,
      ruby: "",
      rbs: "",
      errors: [e.message]
    }.to_json
  rescue StandardError => e
    {
      success: false,
      ruby: "",
      rbs: "",
      errors: ["Compilation error: " + e.message + " at " + e.backtrace.first.to_s]
    }.to_json
  end
end

def __trb_health_check__
  {
    loaded: defined?(TRuby) == "constant",
    version: defined?(TRuby::VERSION) ? TRuby::VERSION : "unknown",
    ruby_version: RUBY_VERSION
  }.to_json
end
\`;

let vm = null;
let isReady = false;

// Send message to main thread
function sendToMain(type, data, requestId) {
  self.postMessage({ type, data, requestId });
}

// Fetch T-Ruby library file
async function fetchTRubyFile(filename) {
  const url = T_RUBY_LIB_BASE + filename;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch ' + filename + ': ' + response.status);
  }
  return await response.text();
}

// Initialize Ruby VM with T-Ruby library
async function initialize() {
  try {
    console.log('[WASM Worker] Step 1: Loading Ruby WASM module...');
    sendToMain('progress', { message: 'Loading Ruby runtime...', progress: 5 });

    const { DefaultRubyVM } = await import(RUBY_WASM_CDN);
    console.log('[WASM Worker] Step 1 complete');

    console.log('[WASM Worker] Step 2: Fetching WASM binary...');
    sendToMain('progress', { message: 'Downloading Ruby WASM binary...', progress: 15 });

    const response = await fetch(RUBY_WASM_BINARY);
    const wasmModule = await WebAssembly.compileStreaming(response);
    console.log('[WASM Worker] Step 2 complete');

    console.log('[WASM Worker] Step 3: Initializing Ruby VM...');
    sendToMain('progress', { message: 'Initializing Ruby VM...', progress: 30 });

    const result = await DefaultRubyVM(wasmModule);
    vm = result.vm;
    console.log('[WASM Worker] Step 3 complete');

    console.log('[WASM Worker] Step 4: Loading T-Ruby library files...');
    sendToMain('progress', { message: 'Loading T-Ruby compiler...', progress: 40 });

    // Load each T-Ruby library file
    const totalFiles = T_RUBY_FILES.length;
    for (let i = 0; i < totalFiles; i++) {
      const filename = T_RUBY_FILES[i];
      const progress = 40 + Math.floor((i / totalFiles) * 50);
      sendToMain('progress', { message: 'Loading ' + filename + '...', progress });

      try {
        const code = await fetchTRubyFile(filename);
        // Remove frozen_string_literal comment and require_relative statements
        // since we're loading files directly
        const processedCode = code
          .replace(/# frozen_string_literal: true\\n?/g, '')
          .replace(/require_relative\\s+["'][^"']+["']\\n?/g, '')
          .replace(/require\\s+["']fileutils["']\\n?/g, '');

        console.log('[WASM Worker] Loading:', filename);
        vm.eval(processedCode);
      } catch (err) {
        console.error('[WASM Worker] Error loading ' + filename + ':', err);
        throw err;
      }
    }
    console.log('[WASM Worker] Step 4 complete');

    console.log('[WASM Worker] Step 5: Running bootstrap code...');
    sendToMain('progress', { message: 'Initializing compiler...', progress: 95 });

    vm.eval(BOOTSTRAP_CODE);
    console.log('[WASM Worker] Step 5 complete');

    // Health check
    const healthResult = vm.eval('__trb_health_check__');
    console.log('[WASM Worker] Health check:', healthResult.toString());

    isReady = true;
    sendToMain('ready', { health: JSON.parse(healthResult.toString()) });

  } catch (error) {
    console.error('[WASM Worker] Init error:', error);
    sendToMain('error', { message: error.message });
  }
}

// Compile code
function compile(code, requestId) {
  if (!isReady || !vm) {
    sendToMain('compile-result', {
      success: false,
      ruby: '',
      rbs: '',
      errors: ['Compiler not ready']
    }, requestId);
    return;
  }

  try {
    console.log('[WASM Worker] Compiling:', code.substring(0, 50) + '...');
    // Use Base64 encoding to safely pass code with any special characters
    const base64Code = btoa(unescape(encodeURIComponent(code)));
    const decodeAndCompile = 'require "base64"; __trb_compile__(Base64.decode64("' + base64Code + '").force_encoding("UTF-8"))';
    const resultJson = vm.eval(decodeAndCompile);
    const result = JSON.parse(resultJson.toString());
    console.log('[WASM Worker] Compile result:', result);
    sendToMain('compile-result', result, requestId);
  } catch (error) {
    console.error('[WASM Worker] Compile error:', error);
    sendToMain('compile-result', {
      success: false,
      ruby: '',
      rbs: '',
      errors: [error.message]
    }, requestId);
  }
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  const { type, data, requestId } = event.data || {};

  switch (type) {
    case 'init':
      initialize();
      break;
    case 'compile':
      compile(data.code, requestId);
      break;
  }
});

// Signal that worker is loaded
sendToMain('loaded', {});
`;

/**
 * Load the T-Ruby WASM compiler using Web Worker
 * Returns cached instance if already loaded
 */
export async function loadTRubyCompiler(
  onProgress?: (progress: LoadingProgress) => void
): Promise<TRubyCompiler> {
  // Return cached compiler if available
  if (compiler) {
    onProgress?.({ state: 'ready', message: 'Compiler ready' });
    return compiler;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading
  loadingPromise = doLoadCompiler(onProgress);

  try {
    compiler = await loadingPromise;
    return compiler;
  } catch (error) {
    loadingPromise = null;
    throw error;
  }
}

async function doLoadCompiler(
  onProgress?: (progress: LoadingProgress) => void
): Promise<TRubyCompiler> {
  return new Promise((resolve, reject) => {
    console.log('[T-Ruby] Creating Web Worker for WASM execution...');
    onProgress?.({
      state: 'loading',
      message: 'Initializing compiler worker...',
      progress: 0
    });

    // Create Web Worker from blob URL
    // Web Workers run in a separate thread, isolated from extension content scripts
    const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    const worker = new Worker(blobUrl, { type: 'module' });

    // Clean up blob URL
    URL.revokeObjectURL(blobUrl);

    // Message handler
    worker.onmessage = (event: MessageEvent) => {
      const { type, data, requestId } = event.data || {};
      console.log('[T-Ruby] Received message from worker:', type, data);

      switch (type) {
        case 'loaded':
          console.log('[T-Ruby] Worker loaded, sending init command...');
          worker.postMessage({ type: 'init' });
          break;

        case 'progress':
          onProgress?.({
            state: 'loading',
            message: data.message,
            progress: data.progress
          });
          break;

        case 'ready':
          console.log('[T-Ruby] Worker ready, health:', data.health);
          healthData = data.health;
          onProgress?.({
            state: 'ready',
            message: 'Compiler ready',
            progress: 100
          });

          // Create compiler interface
          const compilerInstance: TRubyCompiler = {
            async compile(code: string): Promise<CompileResult> {
              return new Promise((res, rej) => {
                const reqId = generateRequestId();
                pendingRequests.set(reqId, { resolve: res, reject: rej });

                console.log('[T-Ruby] Sending compile request:', reqId);
                worker.postMessage({
                  type: 'compile',
                  data: { code },
                  requestId: reqId
                });

                // Timeout after 30 seconds
                setTimeout(() => {
                  if (pendingRequests.has(reqId)) {
                    pendingRequests.delete(reqId);
                    rej(new Error('Compile timeout'));
                  }
                }, 30000);
              });
            },

            healthCheck() {
              return healthData || { loaded: false, version: 'unknown', ruby_version: 'unknown' };
            },

            getVersion() {
              return {
                t_ruby: healthData?.version || 'unknown',
                ruby: healthData?.ruby_version || 'unknown'
              };
            }
          };

          wasmWorker = worker;
          resolve(compilerInstance);
          break;

        case 'compile-result':
          console.log('[T-Ruby] Compile result received for:', requestId);
          const pending = pendingRequests.get(requestId);
          if (pending) {
            pendingRequests.delete(requestId);
            pending.resolve(data);
          }
          break;

        case 'error':
          console.error('[T-Ruby] Worker error:', data.message);
          onProgress?.({
            state: 'error',
            message: data.message
          });
          worker.terminate();
          reject(new Error(data.message));
          break;
      }
    };

    // Error handling
    worker.onerror = (error) => {
      console.error('[T-Ruby] Worker error:', error);
      reject(new Error('Failed to initialize WASM worker'));
    };

    // Timeout for initial load
    const loadTimeout = setTimeout(() => {
      if (!compiler) {
        console.error('[T-Ruby] Worker initialization timeout');
        worker.terminate();
        reject(new Error('WASM worker initialization timeout'));
      }
    }, 120000); // 120 second timeout for initial load (loading many files)

    // Clear timeout when ready
    const originalResolve = resolve;
    resolve = (value) => {
      clearTimeout(loadTimeout);
      originalResolve(value);
    };
  });
}

/**
 * Check if the compiler is loaded
 */
export function isCompilerLoaded(): boolean {
  return compiler !== null;
}

/**
 * Get the current loading state
 */
export function getLoadingState(): LoadingState {
  if (compiler) return 'ready';
  if (loadingPromise) return 'loading';
  return 'idle';
}

/**
 * Preload the compiler (call early to warm up)
 */
export function preloadCompiler(): void {
  if (!compiler && !loadingPromise) {
    loadTRubyCompiler().catch(() => {
      // Silently ignore preload errors
    });
  }
}
