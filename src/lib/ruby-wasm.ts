/**
 * T-Ruby WASM Loader for Playground
 *
 * Uses @t-ruby/wasm package for compilation.
 */

// Types for playground interface
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
  cleanup(): void;
}

export type LoadingState = 'idle' | 'loading' | 'ready' | 'error';

export interface LoadingProgress {
  state: LoadingState;
  message: string;
  progress?: number; // 0-100
  retryCount?: number;
  maxRetries?: number;
}

// Configuration
const CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000, // 1초 초기 지연
  COMPILE_TIMEOUT_MS: 60000, // 60초 컴파일 타임아웃
};

// Version info type matching @t-ruby/wasm VersionInfo
interface VersionInfo {
  tRuby: string;
  rubyWasm: string;
  ruby: string;
}

// Singleton state
let compiler: TRubyCompiler | null = null;
let loadingPromise: Promise<TRubyCompiler> | null = null;
let versionInfo: VersionInfo | null = null;
let retryCount = 0;

/**
 * Sleep helper for retry delay with exponential backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a user-friendly error message
 */
function formatErrorMessage(error: unknown, context: string): string {
  const baseMessage = error instanceof Error ? error.message : String(error);

  // Map common errors to user-friendly messages
  if (baseMessage.includes('Failed to fetch') || baseMessage.includes('NetworkError')) {
    return `네트워크 오류: WASM 파일을 다운로드하지 못했습니다. 인터넷 연결을 확인해주세요.`;
  }
  if (baseMessage.includes('out of memory') || baseMessage.includes('OOM')) {
    return `메모리 부족: 브라우저 메모리가 부족합니다. 다른 탭을 닫고 다시 시도해주세요.`;
  }
  if (baseMessage.includes('timeout') || baseMessage.includes('Timeout')) {
    return `시간 초과: ${context} 작업이 너무 오래 걸렸습니다. 다시 시도해주세요.`;
  }
  if (baseMessage.includes('WebAssembly')) {
    return `WASM 오류: 브라우저가 WebAssembly를 지원하지 않거나 초기화에 실패했습니다.`;
  }

  return `${context} 실패: ${baseMessage}`;
}

/**
 * Load the T-Ruby WASM compiler using @t-ruby/wasm package
 * Returns cached instance if already loaded
 * Includes retry logic for network failures
 */
export async function loadTRubyCompiler(
  onProgress?: (progress: LoadingProgress) => void
): Promise<TRubyCompiler> {
  // Return cached compiler if available
  if (compiler) {
    onProgress?.({ state: 'ready', message: 'Compiler ready', progress: 100 });
    return compiler;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading with retry logic
  loadingPromise = doLoadCompilerWithRetry(onProgress);

  try {
    compiler = await loadingPromise;
    retryCount = 0; // Reset retry count on success
    return compiler;
  } catch (error) {
    loadingPromise = null;
    throw error;
  }
}

/**
 * Load compiler with retry logic
 */
async function doLoadCompilerWithRetry(
  onProgress?: (progress: LoadingProgress) => void
): Promise<TRubyCompiler> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      retryCount = attempt;

      if (attempt > 0) {
        const delay = CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        onProgress?.({
          state: 'loading',
          message: `재시도 중... (${attempt}/${CONFIG.MAX_RETRIES})`,
          progress: 5,
          retryCount: attempt,
          maxRetries: CONFIG.MAX_RETRIES
        });
        await sleep(delay);
      }

      return await doLoadCompiler(onProgress);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[T-Ruby] Load attempt ${attempt + 1} failed:`, lastError.message);

      // Don't retry for certain errors
      if (lastError.message.includes('not supported') ||
          lastError.message.includes('WebAssembly')) {
        break;
      }
    }
  }

  const errorMessage = formatErrorMessage(lastError, '컴파일러 로드');
  throw new Error(errorMessage);
}

/**
 * Promise with timeout helper
 */
function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${operation}`)), ms)
    )
  ]);
}

async function doLoadCompiler(
  onProgress?: (progress: LoadingProgress) => void
): Promise<TRubyCompiler> {
  try {
    console.log('[T-Ruby] Loading @t-ruby/wasm package...');
    onProgress?.({
      state: 'loading',
      message: 'T-Ruby 컴파일러 로드 중...',
      progress: 10,
      retryCount,
      maxRetries: CONFIG.MAX_RETRIES
    });

    // Dynamic import of @t-ruby/wasm
    const { TRuby } = await import('@t-ruby/wasm');

    onProgress?.({
      state: 'loading',
      message: 'Ruby VM 초기화 중...',
      progress: 30,
      retryCount,
      maxRetries: CONFIG.MAX_RETRIES
    });

    // Create and initialize the compiler
    const trb = new TRuby();

    onProgress?.({
      state: 'loading',
      message: 'T-Ruby 라이브러리 로드 중...',
      progress: 50,
      retryCount,
      maxRetries: CONFIG.MAX_RETRIES
    });

    await trb.initialize();

    onProgress?.({
      state: 'loading',
      message: '버전 정보 확인 중...',
      progress: 90,
      retryCount,
      maxRetries: CONFIG.MAX_RETRIES
    });

    // Get version info
    versionInfo = await trb.getVersion();
    console.log('[T-Ruby] Version:', versionInfo);

    onProgress?.({
      state: 'ready',
      message: '컴파일러 준비 완료',
      progress: 100
    });

    // Create compiler interface
    const compilerInstance: TRubyCompiler = {
      async compile(code: string): Promise<CompileResult> {
        try {
          console.log('[T-Ruby] Compiling:', code.substring(0, 50) + '...');

          // Add timeout for compilation
          const result = await withTimeout(
            trb.compile(code),
            CONFIG.COMPILE_TIMEOUT_MS,
            '컴파일'
          );
          console.log('[T-Ruby] Compile result:', result);

          return {
            success: result.success,
            ruby: result.ruby || '',
            rbs: result.rbs || '',
            errors: result.errors?.map(e => e.message) || []
          };
        } catch (error) {
          console.error('[T-Ruby] Compile error:', error);
          const errorMessage = formatErrorMessage(error, '컴파일');
          return {
            success: false,
            ruby: '',
            rbs: '',
            errors: [errorMessage]
          };
        }
      },

      healthCheck() {
        return {
          loaded: trb.isInitialized(),
          version: versionInfo?.tRuby || 'unknown',
          ruby_version: versionInfo?.ruby || 'unknown'
        };
      },

      getVersion() {
        return {
          t_ruby: versionInfo?.tRuby || 'unknown',
          ruby: versionInfo?.ruby || 'unknown'
        };
      },

      cleanup() {
        // Reset state for cleanup on unmount
        console.log('[T-Ruby] Cleanup called');
        // Note: TRuby instance cleanup is handled internally
      }
    };

    return compilerInstance;

  } catch (error) {
    console.error('[T-Ruby] Failed to load compiler:', error);
    const errorMessage = formatErrorMessage(error, '컴파일러 로드');
    onProgress?.({
      state: 'error',
      message: errorMessage
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

/**
 * Cleanup the compiler instance
 * Call this when unmounting components to free resources
 */
export function cleanupCompiler(): void {
  if (compiler) {
    compiler.cleanup();
  }
  compiler = null;
  loadingPromise = null;
  versionInfo = null;
  retryCount = 0;
  console.log('[T-Ruby] Compiler cleaned up');
}

/**
 * Get retry count for displaying in UI
 */
export function getRetryCount(): number {
  return retryCount;
}

/**
 * Get max retries configuration
 */
export function getMaxRetries(): number {
  return CONFIG.MAX_RETRIES;
}
