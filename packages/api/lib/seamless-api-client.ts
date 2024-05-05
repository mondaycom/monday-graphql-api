import { ApiVersionType, QueryVariables, defaultVersion } from './constants';

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
   * @param {ApiVersionType} [apiVersion=defaultVersion] - Can be one of the predefined versions in `AvailableVersions` or a custom version string.
   *        Defaults to the version corresponding to the package version release (which will be the current),
   */
  constructor(apiVersion: ApiVersionType = defaultVersion) {
    this.apiVersion = apiVersion;
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
   * @param {ApiVersionType} [version] - An optional API version string. If provided, this version overrides
   *                                     the class's default API version for this specific query.
   *                                     Can be one of the predefined versions in `AvailableVersions` or a custom version string.
   * @param {number} [timeout=60000] - An optional timeout value in milliseconds for the request. The default is 60 seconds.
   * @returns {Promise<T>} A promise that resolves with the query result.
   * @template T The expected type of the query or mutation result.
   * @throws {Error} Throws an error if called from within the monday.com platform and the request failed, or if the request timed out.
   */
  public seamlessQuery<T>(
    query: string,
    variables?: QueryVariables,
    version?: ApiVersionType,
    timeout: number = 60000,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const requestId = this.generateRequestId();
      const params = { query, variables };
      const apiVersion = version || this.apiVersion;

      window.parent.postMessage({ method: 'api', args: { params, apiVersion }, requestId }, '*');

      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);

      const removeListener = this.addListener(requestId, (data) => {
        clearTimeout(timeoutId);
        removeListener();
        if (data.errorMessage) {
          reject(new Error(`${data.errorMessage} - ${data.data}`));
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
}
