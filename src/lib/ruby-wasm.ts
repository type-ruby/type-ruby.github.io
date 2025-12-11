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
    onProgress?.({
      state: 'loading',
      message: 'Loading Ruby runtime...',
      progress: 10
    });

    const { DefaultRubyVM } = await import(/* webpackIgnore: true */ RUBY_WASM_CDN);

    onProgress?.({
      state: 'loading',
      message: 'Downloading Ruby WASM binary...',
      progress: 30
    });

    // Step 2: Fetch and compile WASM binary
    const response = await fetch(RUBY_WASM_BINARY);
    const wasmModule = await WebAssembly.compileStreaming(response);

    onProgress?.({
      state: 'loading',
      message: 'Initializing Ruby VM...',
      progress: 60
    });

    // Step 3: Initialize Ruby VM
    const { vm } = await DefaultRubyVM(wasmModule);
    rubyVM = vm;

    onProgress?.({
      state: 'loading',
      message: 'Loading T-Ruby compiler...',
      progress: 80
    });

    // Step 4: Load T-Ruby library
    // For now, we'll use a simplified approach that works without VFS mounting
    // In production, the T-Ruby lib files should be bundled or fetched

    // Initialize the compiler bootstrap
    vm.eval(BOOTSTRAP_CODE);

    onProgress?.({
      state: 'ready',
      message: 'Compiler ready',
      progress: 100
    });

    // Return compiler interface
    return {
      compile(code: string): CompileResult {
        const resultJson = vm.eval(`__trb_compile__(${JSON.stringify(code)})`);
        return JSON.parse(resultJson.toString());
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
