/**
 * T-Ruby WASM Loader for Playground
 *
 * Handles lazy loading and initialization of Ruby WASM with T-Ruby compiler
 */

// CDN URLs
const RUBY_WASM_CDN = 'https://cdn.jsdelivr.net/npm/@ruby/3.3-wasm-wasi@2.7.0/dist/browser/+esm';
const RUBY_WASM_BINARY = 'https://cdn.jsdelivr.net/npm/@ruby/3.3-wasm-wasi@2.7.0/dist/ruby+stdlib.wasm';
const T_RUBY_LIB_CDN = 'https://cdn.jsdelivr.net/npm/@t-ruby/wasm/dist/lib/';

// Types
export interface CompileResult {
  success: boolean;
  ruby: string;
  rbs: string;
  errors: string[];
}

export interface TRubyCompiler {
  compile(code: string): CompileResult;
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
let rubyVM: any = null;
let compiler: TRubyCompiler | null = null;
let loadingPromise: Promise<TRubyCompiler> | null = null;

// Bootstrap code for T-Ruby compiler
const BOOTSTRAP_CODE = `
require "json"

# Global compiler instance
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

def __trb_version__
  {
    t_ruby: defined?(TRuby::VERSION) ? TRuby::VERSION : "unknown",
    ruby: RUBY_VERSION
  }.to_json
end
`;

/**
 * Load the T-Ruby WASM compiler
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
  try {
    // Step 1: Load Ruby WASM module
    console.log('[T-Ruby] Step 1: Loading Ruby WASM module from', RUBY_WASM_CDN);
    onProgress?.({
      state: 'loading',
      message: 'Loading Ruby runtime...',
      progress: 10
    });

    const { DefaultRubyVM } = await import(/* webpackIgnore: true */ RUBY_WASM_CDN);
    console.log('[T-Ruby] Step 1 complete: DefaultRubyVM loaded');

    onProgress?.({
      state: 'loading',
      message: 'Downloading Ruby WASM binary...',
      progress: 30
    });

    // Step 2: Fetch and compile WASM binary
    console.log('[T-Ruby] Step 2: Fetching WASM binary from', RUBY_WASM_BINARY);
    const response = await fetch(RUBY_WASM_BINARY);
    console.log('[T-Ruby] Step 2: WASM fetch response status:', response.status);
    const wasmModule = await WebAssembly.compileStreaming(response);
    console.log('[T-Ruby] Step 2 complete: WASM module compiled');

    onProgress?.({
      state: 'loading',
      message: 'Initializing Ruby VM...',
      progress: 60
    });

    // Step 3: Initialize Ruby VM
    console.log('[T-Ruby] Step 3: Initializing Ruby VM...');
    const { vm } = await DefaultRubyVM(wasmModule);
    rubyVM = vm;
    console.log('[T-Ruby] Step 3 complete: Ruby VM initialized');

    onProgress?.({
      state: 'loading',
      message: 'Loading T-Ruby compiler...',
      progress: 80
    });

    // Step 4: Load T-Ruby library
    console.log('[T-Ruby] Step 4: Loading T-Ruby compiler bootstrap...');

    // Initialize the compiler bootstrap
    vm.eval(BOOTSTRAP_CODE);
    console.log('[T-Ruby] Step 4 complete: Bootstrap code evaluated');

    // Health check
    const healthResult = vm.eval('__trb_health_check__');
    console.log('[T-Ruby] Health check:', healthResult.toString());

    onProgress?.({
      state: 'ready',
      message: 'Compiler ready',
      progress: 100
    });

    // Return compiler interface
    return {
      compile(code: string): CompileResult {
        console.log('[T-Ruby] Compiling code:', code.substring(0, 100) + (code.length > 100 ? '...' : ''));
        try {
          const resultJson = vm.eval(`__trb_compile__(${JSON.stringify(code)})`);
          const resultStr = resultJson.toString();
          console.log('[T-Ruby] Raw compile result:', resultStr);
          const result = JSON.parse(resultStr);
          console.log('[T-Ruby] Parsed compile result:', result);
          return result;
        } catch (e) {
          console.error('[T-Ruby] Compile error:', e);
          throw e;
        }
      },

      healthCheck() {
        const resultJson = vm.eval('__trb_health_check__');
        return JSON.parse(resultJson.toString());
      },

      getVersion() {
        const resultJson = vm.eval('__trb_version__');
        return JSON.parse(resultJson.toString());
      }
    };
  } catch (error) {
    console.error('[T-Ruby] Loading error:', error);
    onProgress?.({
      state: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
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
