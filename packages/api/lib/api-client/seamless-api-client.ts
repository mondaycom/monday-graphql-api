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
   * headers (currently `Idempotency-Key`) and drops the rest.
   */
  headers?: Record<string, string>;
  /**
   * Sent as the `Idempotency-Key` header. Takes precedence over an `Idempotency-Key`
   * passed in `headers`, regardless of header name casing.
   */
  idempotencyKey?: string;
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
  private listeners: Record<string, Set<ListenerCallback>> = {};

  /**
   * @param {ApiVersionType} [apiVersion=DEFAULT_VERSION] - Can be one of the predefined versions in `AvailableVersions` or a custom version string.
   *        Defaults to the version corresponding to the package version release (which will be the current),
   */
  constructor(apiVersion: ApiVersionType = DEFAULT_VERSION) {
    this.apiVersion = apiVersion;
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }
  /**
   * Performs a seamless query to the Monday API. This function is intended for use exclusively within
   * client side of a app thats deployed in Monday.com. It leverages the platform's internal messaging system to
   * communicate with the API.
   *
   * By specifying an `version` parameter, you can override the default API version set at the class level.
   * This allows for flexible API version control on a per-query basis, enabling the use of different
   * API versions for specific calls if necessary.
   *
   * @param {string} query - The GraphQL query or mutation string to be sent to the Monday API.
   * @param {QueryVariables} [variables] - An optional object containing variables for the query.
   *                                       `QueryVariables` is a type alias for `Record<string, any>`, allowing specification
   *                                       of key-value pairs where the value can be any type. This parameter is used to provide
   *                                       dynamic values in the query or mutation.
   * @param {ApiVersionType | SeamlessRequestOptions} [versionOrOptions] - Either an API version string that
   *                                     overrides the class's default API version for this query, or a
   *                                     `SeamlessRequestOptions` object (`versionOverride`, `timeoutMs`, `headers`,
   *                                     `idempotencyKey`).
   * @param {number} [timeout=60000] - An optional timeout value in milliseconds for the request. The default is 60 seconds.
   *                                   Used only when `versionOrOptions` is a version string or undefined.
   * @returns {Promise<T>} A promise that resolves with the query result.
   * @template T The expected type of the query or mutation result.
   * @throws {Error} Throws an error if called from within the monday.com platform and the request failed, or if the request timed out.
   */
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
          // Include errors, partial data, and extensions in the error response
          const error = new SeamlessApiClientError(
            data.errorMessage,
            data.data?.errors,
            data.data?.data,
            data.data?.extensions,
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
