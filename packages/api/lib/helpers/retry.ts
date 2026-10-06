import { ClientError } from 'graphql-request';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  retryOnComplexity?: boolean;
  retryOnRateLimit?: boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  retryOnComplexity: true,
  retryOnRateLimit: true,
};

function isRetryableError(error: unknown, options: Required<RetryOptions>): boolean {
  if (error instanceof ClientError) {
    const status = error.response?.status;
    if (status === 429 && options.retryOnRateLimit) return true;
    if (status === 503) return true;

    const errors = error.response?.errors;
    if (errors && Array.isArray(errors)) {
      for (const err of errors) {
        const code = err.extensions?.code;
        if (code === 'complexityBudgetExhausted' && options.retryOnComplexity) return true;
        if (code === 'rateLimitExceeded' && options.retryOnRateLimit) return true;
      }
    }
  }
  return false;
}

function getRetryAfterMs(error: unknown): number | null {
  if (error instanceof ClientError) {
    const headers = error.response?.headers;
    if (headers) {
      const retryAfter = headers instanceof Map ? headers.get('retry-after') : null;
      if (retryAfter) {
        const seconds = parseFloat(retryAfter);
        if (!isNaN(seconds)) return seconds * 1000;
      }
    }
  }
  return null;
}

function calculateDelay(attempt: number, options: Required<RetryOptions>, error: unknown): number {
  const retryAfter = getRetryAfterMs(error);
  if (retryAfter) return Math.min(retryAfter, options.maxDelayMs);

  const exponentialDelay = options.initialDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * options.initialDelayMs * 0.5;
  return Math.min(exponentialDelay + jitter, options.maxDelayMs);
}

/**
 * Wraps an async operation with retry logic using exponential backoff.
 * Retries on rate limit (429), complexity budget exhausted, and 503 errors.
 *
 * Usage:
 * ```ts
 * const result = await withRetry(() => client.request(query, variables), { maxRetries: 3 });
 * ```
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };

  let lastError: unknown;
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === opts.maxRetries || !isRetryableError(error, opts)) {
        throw error;
      }
      const delay = calculateDelay(attempt, opts, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
