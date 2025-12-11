/**
 * T-Ruby WASM Loader for Playground
 *
 * Uses a sandboxed iframe with srcdoc to isolate WASM execution from browser extensions
 * that might interfere with FinalizationRegistry and other APIs.
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
let workerIframe: HTMLIFrameElement | null = null;
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

// Worker HTML content - embedded as string to use srcdoc
// This creates an about:srcdoc origin iframe which most extensions don't target
const WORKER_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://cdn.jsdelivr.net;">
  <title>T-Ruby WASM Worker</title>
</head>
<body>
<script>
// Protect native APIs before any extension can modify them
(function() {
  const nativeFinalizationRegistry = window.FinalizationRegistry;
  const nativeWeakRef = window.WeakRef;

  // Ensure these are the native implementations
  Object.defineProperty(window, 'FinalizationRegistry', {
    value: nativeFinalizationRegistry,
    writable: false,
    configurable: false
  });

  Object.defineProperty(window, 'WeakRef', {
    value: nativeWeakRef,
    writable: false,
    configurable: false
  });
})();
<\/script>
<script type="module">
// CDN URLs
const RUBY_WASM_CDN = 'https://cdn.jsdelivr.net/npm/@ruby/3.3-wasm-wasi@2.7.0/dist/browser/+esm';
const RUBY_WASM_BINARY = 'https://cdn.jsdelivr.net/npm/@ruby/3.3-wasm-wasi@2.7.0/dist/ruby+stdlib.wasm';

// Bootstrap code for T-Ruby compiler
const BOOTSTRAP_CODE = \`
require "json"

$trb_compiler = nil

def get_compiler
  $trb_compiler ||= TRuby::Compiler.new
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
      errors: ["Compilation error: " + e.message]
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

// Send message to parent
function sendToParent(type, data, requestId) {
  parent.postMessage({ type, data, requestId }, '*');
}

// Initialize Ruby VM
async function initialize() {
  try {
    console.log('[WASM Worker] Step 1: Loading Ruby WASM module...');
    sendToParent('progress', { message: 'Loading Ruby runtime...', progress: 10 });

    const { DefaultRubyVM } = await import(RUBY_WASM_CDN);
    console.log('[WASM Worker] Step 1 complete');

    console.log('[WASM Worker] Step 2: Fetching WASM binary...');
    sendToParent('progress', { message: 'Downloading Ruby WASM binary...', progress: 30 });

    const response = await fetch(RUBY_WASM_BINARY);
    const wasmModule = await WebAssembly.compileStreaming(response);
    console.log('[WASM Worker] Step 2 complete');

    console.log('[WASM Worker] Step 3: Initializing Ruby VM...');
    sendToParent('progress', { message: 'Initializing Ruby VM...', progress: 60 });

    const result = await DefaultRubyVM(wasmModule);
    vm = result.vm;
    console.log('[WASM Worker] Step 3 complete');

    console.log('[WASM Worker] Step 4: Loading T-Ruby bootstrap...');
    sendToParent('progress', { message: 'Loading T-Ruby compiler...', progress: 80 });

    vm.eval(BOOTSTRAP_CODE);
    console.log('[WASM Worker] Step 4 complete');

    // Health check
    const healthResult = vm.eval('__trb_health_check__');
    console.log('[WASM Worker] Health check:', healthResult.toString());

    isReady = true;
    sendToParent('ready', { health: JSON.parse(healthResult.toString()) });

  } catch (error) {
    console.error('[WASM Worker] Init error:', error);
    sendToParent('error', { message: error.message });
  }
}

// Compile code
function compile(code, requestId) {
  if (!isReady || !vm) {
    sendToParent('compile-result', {
      success: false,
      errors: ['Compiler not ready']
    }, requestId);
    return;
  }

  try {
    console.log('[WASM Worker] Compiling:', code.substring(0, 50) + '...');
    const resultJson = vm.eval('__trb_compile__(' + JSON.stringify(code) + ')');
    const result = JSON.parse(resultJson.toString());
    console.log('[WASM Worker] Compile result:', result);
    sendToParent('compile-result', result, requestId);
  } catch (error) {
    console.error('[WASM Worker] Compile error:', error);
    sendToParent('compile-result', {
      success: false,
      ruby: '',
      rbs: '',
      errors: [error.message]
    }, requestId);
  }
}

// Listen for messages from parent
window.addEventListener('message', (event) => {
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
sendToParent('loaded', {});
<\/script>
</body>
</html>`;

/**
 * Load the T-Ruby WASM compiler using sandboxed iframe with srcdoc
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
    console.log('[T-Ruby] Creating sandboxed srcdoc iframe for WASM execution...');
    onProgress?.({
      state: 'loading',
      message: 'Initializing compiler sandbox...',
      progress: 5
    });

    // Create sandboxed iframe with srcdoc
    // Using srcdoc creates an about:srcdoc origin which most extensions don't target
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // allow-scripts: needed to run JavaScript
    // allow-same-origin: needed for postMessage to work properly
    iframe.sandbox.add('allow-scripts');
    iframe.srcdoc = WORKER_HTML;

    // Message handler
    const messageHandler = (event: MessageEvent) => {
      // Only accept messages from our iframe
      if (event.source !== iframe.contentWindow) return;

      const { type, data, requestId } = event.data || {};
      console.log('[T-Ruby] Received message from worker:', type, data);

      switch (type) {
        case 'loaded':
          console.log('[T-Ruby] Worker iframe loaded, sending init command...');
          iframe.contentWindow?.postMessage({ type: 'init' }, '*');
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
                iframe.contentWindow?.postMessage({
                  type: 'compile',
                  data: { code },
                  requestId: reqId
                }, '*');

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

          workerIframe = iframe;
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
          window.removeEventListener('message', messageHandler);
          document.body.removeChild(iframe);
          reject(new Error(data.message));
          break;
      }
    };

    window.addEventListener('message', messageHandler);

    // Error handling for iframe load failure
    iframe.onerror = () => {
      console.error('[T-Ruby] Failed to load worker iframe');
      window.removeEventListener('message', messageHandler);
      reject(new Error('Failed to load WASM worker'));
    };

    // Timeout for initial load
    const loadTimeout = setTimeout(() => {
      if (!compiler) {
        console.error('[T-Ruby] Worker initialization timeout');
        window.removeEventListener('message', messageHandler);
        document.body.removeChild(iframe);
        reject(new Error('WASM worker initialization timeout'));
      }
    }, 60000); // 60 second timeout for initial load

    // Clear timeout when ready
    const originalResolve = resolve;
    resolve = (value) => {
      clearTimeout(loadTimeout);
      originalResolve(value);
    };

    // Add iframe to document
    document.body.appendChild(iframe);
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
