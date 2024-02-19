import { GraphQLClient } from 'graphql-request';
import { AvailableVersions, defaultVersion } from './constants';
import { Sdk, getSdk } from './generated/sdk';
import pkg from '../package.json';
export class ApiClient {
  private readonly client: GraphQLClient;
  public readonly operations: Sdk;

  constructor(token: string, apiVersion: AvailableVersions | string = defaultVersion) {
    this.client = new GraphQLClient('https://api.monday.com/v2', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'API-Version': apiVersion,
        'Api-Sdk-Version': pkg.version,
      },
    });

    this.operations = getSdk(this.client);
  }

  public query = async <T>(query: string, variables?: Record<string, any>) => {
    const res = await this.client.request<T>(query, variables);
    return res;
  };
}
