import { GraphQLClient } from 'graphql-request';
import { ApiVersionType, DEFAULT_VERSION, MONDAY_API_ENDPOINT, QueryVariables } from './constants/index';
import { Sdk, getSdk } from './generated/sdk';
import pkg from '../package.json';

/**
 * The `ApiClient` class provides a structured way to interact with the Monday.com API,
 * handling GraphQL requests with configurable API versioning.
 *
 * This class is designed to be initialized with an authentication token and an optional
 * API version, setting up the necessary headers for all subsequent API requests.
 */
export class ApiClient {
  private readonly client: GraphQLClient;
  public readonly operations: Sdk;
  public readonly apiVersion: ApiVersionType;

  /**
   * Constructs a new `ApiClient` instance, initializing the GraphQL client with
   * the specified authentication token and API version.
   *
   * @param {string} token - The authentication token required for making API requests to Monday.com.
   * @param {string} [apiVersion=DEFAULT_VERSION] - The API version to use for requests.
   *        Defaults to the version corresponding to the package version release (which will be the current), but can be specified with custom string.
   */

  constructor(token: string, apiVersion: string = DEFAULT_VERSION) {
    this.apiVersion = apiVersion;
    const endpoint = process.env.MONDAY_API_ENDPOINT || MONDAY_API_ENDPOINT;
    this.client = new GraphQLClient(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'API-Version': this.apiVersion,
        'Api-Sdk-Version': pkg.version,
      },
    });

    this.operations = getSdk(this.client);
  }

  /**
   * Performs a GraphQL query or mutation to the Monday.com API using the configured
   * GraphQL client. This method is asynchronous and returns a promise that resolves
   * with the query result.
   *
   * @param {string} query - The GraphQL query or mutation string.
   * @param {QueryVariables} [variables] - An optional object containing variables for the query.
   *        `QueryVariables` is a type alias for `Record<string, any>`, allowing specification
   *        of key-value pairs where the value can be any type. This parameter is used to provide
   *        dynamic values in the query or mutation.
   * @returns {Promise<T>} A promise that resolves with the result of the query or mutation.
   * @template T The expected type of the query or mutation result.
   */
  public query = async <T>(query: string, variables?: QueryVariables): Promise<T> => {
    const res = await this.client.request<T>(query, variables);
    return res;
  };
}
