import { ApiClient } from '../lib/api-client';
import type { RequestConfig } from 'graphql-request/build/legacy/helpers/types';

const createFetchMock = (responseData: unknown, delayMs = 0): NonNullable<RequestConfig['fetch']> => {
  return async (_input: URL | RequestInfo, init?: RequestInit): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
      const abortSignal = init?.signal;
      const abortError = () => new DOMException('The user aborted a request.', 'AbortError');

      if (abortSignal?.aborted) {
        reject(abortError());
        return;
      }

      const timeoutId = setTimeout(() => {
        resolve(
          new Response(JSON.stringify({ data: responseData }), {
            status: 200,
            headers: { 'content-type': 'application/graphql-response+json' },
          }),
        );
      }, delayMs);

      abortSignal?.addEventListener(
        'abort',
        () => {
          clearTimeout(timeoutId);
          reject(abortError());
        },
        { once: true },
      );
    });
  };
};

describe('ApiClient timeout integration', () => {

  describe('request method', () => {
    it('should abort request when timeout is exceeded', async () => {
      const apiClient = new ApiClient({
        token: 'test-token',
        requestConfig: { fetch: createFetchMock({ users: [] }, 2000) },
      });
      const query = '{ users { id } }';

      await expect(apiClient.request(query, undefined, { timeout: 100 })).rejects.toThrow('The user aborted a request.');
    });

    it('should complete successfully when response arrives before timeout', async () => {
      const apiClient = new ApiClient({
        token: 'test-token',
        requestConfig: { fetch: createFetchMock({ users: [{ id: '1' }] }, 50) },
      });
      const query = '{ users { id } }';

      const result = await apiClient.request(query, undefined, { timeout: 500 });
      expect(result).toEqual({ users: [{ id: '1' }] });
    });

    it('should work without timeout option', async () => {
      const apiClient = new ApiClient({
        token: 'test-token',
        requestConfig: { fetch: createFetchMock({ users: [{ id: '1', name: 'John' }] }) },
      });
      const query = '{ users { id name } }';

      const result = await apiClient.request(query);
      expect(result).toEqual({ users: [{ id: '1', name: 'John' }] });
    });
  });

  describe('rawRequest method', () => {
    it('should abort rawRequest when timeout is exceeded', async () => {
      const apiClient = new ApiClient({
        token: 'test-token',
        requestConfig: { fetch: createFetchMock({ users: [] }, 2000) },
      });
      const query = '{ users { id } }';

      await expect(apiClient.rawRequest(query, undefined, { timeout: 100 })).rejects.toThrow('The user aborted a request.');
    });

    it('should complete rawRequest successfully when response arrives before timeout', async () => {
      const apiClient = new ApiClient({
        token: 'test-token',
        requestConfig: { fetch: createFetchMock({ users: [{ id: '1' }] }, 50) },
      });
      const query = '{ users { id } }';

      const result = await apiClient.rawRequest(query, undefined, { timeout: 500 });
      expect(result.data).toEqual({ users: [{ id: '1' }] });
    });
  });
});
