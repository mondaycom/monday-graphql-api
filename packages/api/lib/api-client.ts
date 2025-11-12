import { GraphQLClient, ClientError } from 'graphql-request';
import { ApiVersionType, DEFAULT_VERSION, QueryVariables } from './constants/index';
import { Sdk, getSdk } from './generated/sdk';
import pkg from '../package.json';
import { getApiEndpoint } from './shared/get-api-endpoint';
import { GraphQLClientResponse, RequestConfig } from 'graphql-request/build/esm/types';

export { ClientError };

export interface ApiClientConfig {
  token: string;
  apiVersion?: string;
  endpoint?: string;
  requestConfig?: RequestConfig;
}

export interface RequestOptions {
  versionOverride?: string;
}

/**
 * The `ApiClient` class provides a structured way to interact with the Monday.com API,
 * handling GraphQL requests with configurable API versioning.
 *
 * This class is designed to be initialized with an authentication token and an optional
 * API version, setting up the necessary headers for all subsequent API requests.
 */
export class ApiClient {
  private readonly token: string;
  private readonly defaultApiVersion: ApiVersionType;
  private readonly defaultEndpoint?: string;
  private readonly requestConfig?: RequestConfig;
  public readonly operations: Sdk;

  /**
   * Constructs a new `ApiClient` instance, storing configuration for dynamic client creation.
   *
   * @param {ApiClientConfig} config - Configuration for the API client.
   *        Requires `token`, and optionally includes `apiVersion` and `requestConfig`.
   */
  constructor(config: ApiClientConfig) {
    const { token, apiVersion = DEFAULT_VERSION, endpoint, requestConfig = {} } = config;
    if (!this.isValidApiVersion(apiVersion)) {
      throw new Error(
        "Invalid API version format. Expected format is 'yyyy-mm' with month as one of '01', '04', '07', or '10'.",
      );
    }

    this.token = token;
    this.defaultApiVersion = apiVersion;
    this.defaultEndpoint = endpoint;
    this.requestConfig = requestConfig;

    // Create operations using a default client for backward compatibility
    const defaultClient = this.createClient();
    this.operations = getSdk(defaultClient);
  }

  /**
   * Creates a GraphQL client with the specified options
   *
   * @param {RequestOptions} [options] - Optional request configuration
   * @returns {GraphQLClient} - Configured GraphQL client
   */
  private createClient(options?: RequestOptions): GraphQLClient {
    const { versionOverride } = options || {};
    const apiVersionToUse = versionOverride ?? this.defaultApiVersion;

    if (versionOverride && !this.isValidApiVersion(versionOverride)) {
      throw new Error(
        "Invalid API version format. Expected format is 'yyyy-mm' with month as one of '01', '04', '07', or '10'.",
      );
    }

    const endpoint = getApiEndpoint(this.defaultEndpoint);
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: this.token,
      'API-Version': apiVersionToUse,
      'Api-Sdk-Version': pkg.version,
    };

    const mergedHeaders = {
      ...defaultHeaders,
      ...(this.requestConfig?.headers || {}),
    };

    return new GraphQLClient(endpoint, {
      ...this.requestConfig,
      headers: mergedHeaders,
    });
  }

  /**
   * Performs a GraphQL query or mutation to the Monday.com API using a dynamically created
   * GraphQL client. This method is asynchronous and returns a promise that resolves
   * with the query result.
   *
   * @param {string} query - The GraphQL query or mutation string.
   * @param {QueryVariables} [variables] - An optional object containing variables for the query.
   *        `QueryVariables` is a type alias for `Record<string, any>`, allowing specification
   *        of key-value pairs where the value can be any type. This parameter is used to provide
   *        dynamic values in the query or mutation.
   * @param {RequestOptions} [options] - Optional request configuration including version override.
   * @returns {Promise<T>} A promise that resolves with the result of the query or mutation.
   * @template T The expected type of the query or mutation result.
   */
  public request = async <T>(query: string, variables?: QueryVariables, options?: RequestOptions): Promise<T> => {
    const client = this.createClient(options);
    return client.request<T>(query, variables);
  };

  /**
   * Performs a raw GraphQL query or mutation to the Monday.com API using a dynamically created
   * GraphQL client. This method is asynchronous and returns a promise that resolves
   * with the query result.
   *
   * The result will be in the raw format: data, errors, extensions.
   *
   * @param {string} query - The GraphQL query or mutation string.
   * @param {QueryVariables} [variables] - An optional object containing variables for the query.
   *        `QueryVariables` is a type alias for `Record<string, any>`, allowing specification
   *        of key-value pairs where the value can be any type. This parameter is used to provide
   *        dynamic values in the query or mutation.
   * @param {RequestOptions} [options] - Optional request configuration including version override.
   * @returns {Promise<T>} A promise that resolves with the result of the query or mutation.
   * @template T The expected type of the query or mutation result.
   */
  public rawRequest = async <T>(
    query: string,
    variables?: QueryVariables,
    options?: RequestOptions,
  ): Promise<GraphQLClientResponse<T>> => {
    const client = this.createClient(options);
    return client.rawRequest<T>(query, variables);
  };

  /**
   * Validates the API version format (yyyy-mm), restricting mm to 01, 04, 07, or 10.
   *
   * @param {string} version - The API version string to validate.
   * @returns {boolean} - Returns true if the version matches yyyy-mm format with allowed months.
   */
  private isValidApiVersion(version: string): boolean {
    return version === 'dev' || /^\d{4}-(01|04|07|10)$/.test(version);
  }
}
