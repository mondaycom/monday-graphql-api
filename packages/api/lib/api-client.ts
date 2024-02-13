import { GraphQLClient } from 'graphql-request';
import { AvailableVersions, defaultVersion } from './constants';
import { Sdk, getSdk } from './generated/sdk';

export class ApiClient {
  private readonly client: GraphQLClient | undefined;
  public readonly operations: Sdk | undefined;
  public readonly apiVersion: AvailableVersions | string;
  listeners: any;

  constructor(apiVersion: AvailableVersions | string = defaultVersion, token?: string) {
    this.apiVersion = apiVersion;
    if (token) {
      this.client = new GraphQLClient('https://api.monday.com/v2', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.toString(),
          'API-Version': apiVersion.toString(),
          'Api-Sdk-Version': '0.1.0',
        },
      });

      this.operations = getSdk(this.client);
    }
  }

  public query = async <T>(query: string, variables?: Record<string, any>) => {
    if (this.client) {
      const res = await this.client.request<T>(query, variables);
      return res;
    } else {
      throw new Error('No client available, make sure you initialize the client with a token first');
    }
  };

  public seamlessQuery = async <T>(query: string, variables?: Record<string, any>) => {
    return new Promise<T>((resolve, reject) => {
      const requestId = this._generateRequestId();
      const params = { query, variables };
      const apiVersion = this.apiVersion;

      window.parent.postMessage({ method: 'api', args: { params, apiVersion }, requestId }, '*');
      const removeListener = this._addListener(requestId, (data) => {
        removeListener();
        if (data.errorMessage) {
          const error = new Error(data.errorMessage);
          error.message += ` - ${data.data}`;
          reject(error);
        } else {
          resolve(data as T);
        }
      });
    });
  };

  private _generateRequestId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  _addListener(key: string, callback: (data: any) => void) {
    this.listeners[key] = this.listeners[key] || new Set();
    this.listeners[key].add(callback);

    return () => {
      this.listeners[key].delete(callback);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    };
  }
}
