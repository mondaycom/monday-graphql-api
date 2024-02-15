import { GraphQLClient } from 'graphql-request';
import { ApiClient } from '../api-client';
import { defaultVersion } from '../constants';
import { getSdk } from '../generated/sdk';

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
        'API-Version': defaultVersion,
        'Api-Sdk-Version': '0.1.0',
      },
    });

    expect(apiClient.operations).toBeDefined();
  });
});
