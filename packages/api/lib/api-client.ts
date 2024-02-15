import { GraphQLClient } from 'graphql-request';
import { AvailableVersions, defaultVersion } from './constants';
import { Sdk, getSdk } from './generated/sdk';

export class ApiClient {
  private readonly client: GraphQLClient;
  public readonly operations: Sdk;

  constructor(token: string, apiVersion: AvailableVersions | string = defaultVersion) {
    this.client = new GraphQLClient('https://api.monday.com/v2', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token.toString(),
        'API-Version': apiVersion,
        'Api-Sdk-Version': '0.1.0',
      },
    });

    this.operations = getSdk(this.client);
  }

  public query = async <T>(query: string, variables?: Record<string, any>) => {
    const res = await this.client.request<T>(query, variables);
    return res;
  };
}
