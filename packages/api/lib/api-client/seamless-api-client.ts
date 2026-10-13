import { ApiVersionType, DEFAULT_VERSION, QueryVariables } from '../constants';
import { SeamlessApiClientError } from '../errors/seamless-api-client-error';
import { mergeHeaders } from '../shared/merge-headers';

export { SeamlessApiClientError };

export interface SeamlessRequestOptions {
  /** API version for this request only. Overrides the version set on the client. */
  versionOverride?: ApiVersionType;
  /** Request timeout in milliseconds. Defaults to 60 seconds. */
  timeoutMs?: number;
  /**
   * Headers to send with this request. The monday.com host forwards only allowlisted
   * headers and drops the rest.
   */
  headers?: Record<string, string>;
  /**
   * Sent as the `Idempotency-Key` header. Takes precedence over an `Idempotency-Key`
   * passed in `headers`.
   */
  idempotencyKey?: string;
}

export type SeamlessErrorPolicy = 'none' | 'ignore' | 'all';

export interface SeamlessApiClientOptions {
  /**
   * How to handle a reply that carries GraphQL `errors`, matching `ApiClient`'s `requestConfig.errorPolicy`:
   * `none` (default) rejects with `SeamlessApiClientError`; `ignore` resolves with the partial `data` and drops
   * `errors`; `all` resolves with both `data` and `errors`. Host failures with no GraphQL `errors` always reject.
   */
  errorPolicy?: SeamlessErrorPolicy;
}

const DEFAULT_TIMEOUT_MS = 60000;

interface ListenerCallback {
  (data: any): void;
}

/**
 * The `SeamlessApiClient` class provides functionality for making seamless API requests to Monday.com.
 * It is specifically designed to be used within the client side of applications deployed on Monday.com,
 * leveraging the platform's internal messaging system for communication with the API.
 *
 */
export class SeamlessApiClient {
  public readonly apiVersion: ApiVersionType;
  private readonly errorPolicy: SeamlessErrorPolicy;
  private listeners: Record<string, Set<ListenerCallback>> = {};

  /**
   * @param {ApiVersionType} [apiVersion=DEFAULT_VERSION] - Can be one of the predefined versions in `AvailableVersions` or a custom version string.
   *        Defaults to the version corresponding to the package version release (which will be the current),
   * @param {SeamlessApiClientOptions} [options] - Optional client settings: `errorPolicy` (`none` by default).
   */
  constructor(apiVersion: ApiVersionType = DEFAULT_VERSION, options: SeamlessApiClientOptions = {}) {
    this.apiVersion = apiVersion;
    this.errorPolicy = options.errorPolicy ?? 'none';
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }
  /**
   * Performs a seamless query to the Monday API. This function is intended for use exclusively within
   * client side of a app thats deployed in Monday.com. It leverages the platform's internal messaging system to
   * communicate with the API.
   *
   * @param {string} query - The GraphQL query or mutation string to be sent to the Monday API.
   * @param {QueryVariables} [variables] - An optional object containing variables for the query.
   *                                       `QueryVariables` is a type alias for `Record<string, any>`, allowing specification
   *                                       of key-value pairs where the value can be any type. This parameter is used to provide
   *                                       dynamic values in the query or mutation.
   * @param {SeamlessRequestOptions} [options] - Optional per-request settings: `versionOverride` (overrides the
   *                                       class's default API version), `timeoutMs` (default 60 seconds), `headers`
   *                                       and `idempotencyKey`.
   * @returns {Promise<T>} A promise that resolves with the query result.
   * @template T The expected type of the query or mutation result.
   * @throws {Error} Throws an error if called from within the monday.com platform and the request failed, or if the request timed out.
   */
  public request<T>(query: string, variables?: QueryVariables, options?: SeamlessRequestOptions): Promise<T>;
  /**
   * @deprecated Pass an options object instead: `{ versionOverride, timeoutMs }`.
   *
   * @param {string} query - The GraphQL query or mutation string to be sent to the Monday API.
   * @param {QueryVariables} [variables] - An optional object containing variables for the query.
   * @param {ApiVersionType} [version] - An optional API version that overrides the class's default for this query.
   * @param {number} [timeout=60000] - An optional timeout value in milliseconds for the request.
   */
  public request<T>(query: string, variables?: QueryVariables, version?: ApiVersionType, timeout?: number): Promise<T>;
  public request<T>(
    query: string,
    variables?: QueryVariables,
    versionOrOptions?: ApiVersionType | SeamlessRequestOptions,
    timeout: number = DEFAULT_TIMEOUT_MS,
  ): Promise<T> {
    const options: SeamlessRequestOptions =
      typeof versionOrOptions === 'object' && versionOrOptions !== null
        ? versionOrOptions
        : { versionOverride: versionOrOptions, timeoutMs: timeout };

    return new Promise<T>((resolve, reject) => {
      if (options.idempotencyKey === '') {
        reject(new Error('idempotencyKey must not be empty'));
        return;
      }

      const requestId = this.generateRequestId();
      const params = { query, variables };
      const apiVersion = options.versionOverride || this.apiVersion;
      const headers = mergeHeaders(
        options.headers,
        options.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : undefined,
      );
      const args = Object.keys(headers).length > 0 ? { params, apiVersion, headers } : { params, apiVersion };

      window.parent.postMessage({ method: 'api', args, requestId }, '*');

      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

      const removeListener = this.addListener(requestId, (data) => {
        clearTimeout(timeoutId);
        removeListener();
        if (data.errorMessage) {
          const hasGraphqlErrors = Array.isArray(data.data?.errors) && data.data.errors.length > 0;
          if (hasGraphqlErrors && this.errorPolicy !== 'none') {
            const { errors, ...rest } = data.data;
            const { errorMessage: _errorMessage, ...reply } = data;
            resolve({ ...reply, data: this.errorPolicy === 'all' ? data.data : rest } as T);
            return;
          }
          // Include errors, partial data, extensions and forwarded response headers in the error response
          const error = new SeamlessApiClientError(
            data.errorMessage,
            data.data?.errors,
            data.data?.data,
            data.data?.extensions,
            data.headers,
          );
          reject(error);
        } else {
          resolve(data as T);
        }
      });
    });
  }

  private generateRequestId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  private addListener(key: string, callback: ListenerCallback): () => void {
    const listenerSet = this.listeners[key] || new Set<ListenerCallback>();
    listenerSet.add(callback);
    this.listeners[key] = listenerSet;

    return () => {
      listenerSet.delete(callback);
      if (listenerSet.size === 0) {
        delete this.listeners[key];
      }
    };
  }

  private receiveMessage(event: MessageEvent): void {
    const { requestId } = event.data;
    const listeners = this.listeners[requestId];

    if (listeners) {
      listeners.forEach((listener) => listener(event.data));
    }
  }
}
