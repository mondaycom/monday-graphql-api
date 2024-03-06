import { GraphQLClient } from 'graphql-request';
import { ApiClient } from '../lib/api-client';
import pkg from '../package.json';

jest.mock('graphql-request', () => {
  return {
    GraphQLClient: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn(),
      };
    }),
  };
});

describe('ApiClient', () => {
  it('should correctly initialize with default parameters', () => {
    const token = 'test-token';
    const apiClient = new ApiClient(token);

    expect(GraphQLClient).toHaveBeenCalledWith('https://api.monday.com/v2', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'API-Version': '2024-04',
        'Api-Sdk-Version': pkg.version,
      },
    });

    expect(apiClient.operations).toBeDefined();
  });
});