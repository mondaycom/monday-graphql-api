import { withRetry } from '../../lib/helpers/retry';
import { ClientError } from 'graphql-request';

function createClientError(status: number, extensions?: { code: string }): ClientError {
  const response: any = {
    status,
    errors: extensions ? [{ message: 'error', extensions }] : [],
  };
  return new ClientError(response, { query: '' });
}

describe('withRetry', () => {
  it('should return result on first success', async () => {
    const result = await withRetry(() => Promise.resolve('ok'));
    expect(result).toBe('ok');
  });

  it('should retry on 429 and succeed', async () => {
    let attempts = 0;
    const result = await withRetry(
      () => {
        attempts++;
        if (attempts < 3) throw createClientError(429);
        return Promise.resolve('success');
      },
      { maxRetries: 3, initialDelayMs: 10 },
    );
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('should retry on complexity budget exhausted', async () => {
    let attempts = 0;
    const result = await withRetry(
      () => {
        attempts++;
        if (attempts < 2) throw createClientError(200, { code: 'complexityBudgetExhausted' });
        return Promise.resolve('done');
      },
      { maxRetries: 3, initialDelayMs: 10 },
    );
    expect(result).toBe('done');
    expect(attempts).toBe(2);
  });

  it('should throw non-retryable errors immediately', async () => {
    const error = new Error('bad input');
    await expect(
      withRetry(() => Promise.reject(error), { maxRetries: 3, initialDelayMs: 10 }),
    ).rejects.toThrow('bad input');
  });

  it('should throw after max retries exhausted', async () => {
    await expect(
      withRetry(
        () => Promise.reject(createClientError(429)),
        { maxRetries: 2, initialDelayMs: 10 },
      ),
    ).rejects.toThrow();
  });

  it('should not retry rate limit when retryOnRateLimit is false', async () => {
    let attempts = 0;
    await expect(
      withRetry(
        () => {
          attempts++;
          return Promise.reject(createClientError(429));
        },
        { maxRetries: 3, initialDelayMs: 10, retryOnRateLimit: false },
      ),
    ).rejects.toThrow();
    expect(attempts).toBe(1);
  });
});
