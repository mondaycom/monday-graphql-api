import { GraphQLClient } from 'graphql-request';
import { ApiVersionType, QueryVariables } from './constants/index';
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
   * @param {ApiVersionType} [apiVersion=defaultVersion] - COMING SOON - NOW IT WILL ALWAYS USE 2024-04. The API version to use for requests.
   *        Can be one of the predefined versions in `AvailableVersions` or a custom version string.
   *        Defaults to `stable` if not specified.
   */
  // constructor(token: string, apiVersion: ApiVersionType = defaultVersion) {
  //   this.apiVersion = apiVersion;
  //   this.client = new GraphQLClient('https://api.monday.com/v2', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: token,
  //       'API-Version': apiVersion,
  //       'Api-Sdk-Version': '0.1.0',
  //     },
  //   });

  //   this.operations = getSdk(this.client);
  // }

  constructor(token: string) {
    this.apiVersion = '2024-04';
    this.client = new GraphQLClient('https://api.monday.com/v2', {
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
