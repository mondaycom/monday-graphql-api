import { GraphQLClient } from 'graphql-request';
import { defaultVersion } from './constants';
import { Sdk, getSdk } from './generated/sdk';

export class ApiClient {
  private readonly client: GraphQLClient;
  public readonly operations: Sdk;

  constructor(token: string, apiVersion = defaultVersion) {
    this.client = new GraphQLClient('https://api.monday.com/v2', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token.toString(),
        'API-Version': apiVersion.toString(),
      },
    });

    this.operations = getSdk(this.client);
  }

  public query = async <T>(query: string, variables?: Record<string, any>) => {
    const res = await this.client.request<T>(query, variables);
    return res;
  };

  public mutation = async <T>(query: string, variables?: Record<string, any>) => {
    const res = await this.client.request<T>(query, variables);
    return res;
  };
}
