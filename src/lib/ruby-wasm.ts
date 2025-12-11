/**
 * T-Ruby WASM Loader for Playground
 *
 * Uses a sandboxed iframe to isolate WASM execution from browser extensions
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

/**
 * Load the T-Ruby WASM compiler using sandboxed iframe
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
    console.log('[T-Ruby] Creating sandboxed iframe for WASM execution...');
    onProgress?.({
      state: 'loading',
      message: 'Initializing compiler sandbox...',
      progress: 5
    });

    // Create sandboxed iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-scripts');
    iframe.src = '/wasm-worker.html';

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
