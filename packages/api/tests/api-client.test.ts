import { GraphQLClient } from 'graphql-request';
import { ApiClient } from '../lib/api-client';
import pkg from '../package.json';
import { DEFAULT_VERSION } from '../lib/constants';

jest.mock('graphql-request', () => {
  return {
    GraphQLClient: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn(),
        rawRequest: jest.fn(),
      };
    }),
  };
});

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly initialize with default parameters', () => {
    const token = 'test-token';
    const apiClient = new ApiClient({ token });

    expect(GraphQLClient).toHaveBeenCalledWith('https://api.monday.com/v2', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'API-Version': DEFAULT_VERSION,
        'Api-Sdk-Version': pkg.version,
      },
    });

    expect(apiClient.operations).toBeDefined();
  });

  describe('request method with timeout', () => {
    it('should successfully complete request before timeout', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';
      const expectedData = { users: [{ id: 1, name: 'John' }] };

      // Mock the request to resolve immediately
      const mockRequest = jest.fn().mockResolvedValue(expectedData);
      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        request: mockRequest,
      }));

      const result = await apiClient.request(query, undefined, { timeout: 5000 });

      expect(result).toEqual(expectedData);
      expect(mockRequest).toHaveBeenCalledWith({
        document: query,
        variables: undefined,
        signal: expect.any(AbortSignal),
      });
    });

    it('should timeout and abort request when exceeding timeout duration', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';

      // Mock the request to delay longer than timeout and respect AbortSignal
      const mockRequest = jest.fn().mockImplementation(({ signal }: { signal: AbortSignal }) =>
        new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            resolve({ users: [{ id: 1, name: 'John' }] });
          }, 1000); // 1 second delay

          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(new Error('The user aborted a request.'));
            });
          }
        }),
      );

      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        request: mockRequest,
      }));

      await expect(apiClient.request(query, undefined, { timeout: 50 })).rejects.toThrow('Request timed out after 50ms');
    });

    it('should successfully complete request without timeout', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';
      const expectedData = { users: [{ id: 1, name: 'John' }] };

      const mockRequest = jest.fn().mockResolvedValue(expectedData);
      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        request: mockRequest,
      }));

      const result = await apiClient.request(query);

      expect(result).toEqual(expectedData);
      expect(mockRequest).toHaveBeenCalledWith(query, undefined);
    });

    it('should pass through other errors even when timeout is set', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';
      const customError = new Error('GraphQL Error');

      const mockRequest = jest.fn().mockRejectedValue(customError);
      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        request: mockRequest,
      }));

      await expect(apiClient.request(query, undefined, { timeout: 5000 })).rejects.toThrow('GraphQL Error');
    });
  });

  describe('rawRequest method with timeout', () => {
    it('should successfully complete rawRequest before timeout', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';
      const expectedResponse = {
        data: { users: [{ id: 1, name: 'John' }] },
        status: 200,
        headers: new Headers(),
      };

      const mockRawRequest = jest.fn().mockResolvedValue(expectedResponse);
      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        rawRequest: mockRawRequest,
      }));

      const result = await apiClient.rawRequest(query, undefined, { timeout: 5000 });

      expect(result).toEqual(expectedResponse);
      expect(mockRawRequest).toHaveBeenCalledWith({
        query,
        variables: undefined,
        signal: expect.any(AbortSignal),
      });
    });

    it('should timeout and abort rawRequest when exceeding timeout duration', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';

      const mockRawRequest = jest.fn().mockImplementation(({ signal }: { signal: AbortSignal }) =>
        new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            resolve({
              data: { users: [{ id: 1, name: 'John' }] },
              status: 200,
              headers: new Headers(),
            });
          }, 1000); // 1 second delay

          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(new Error('The user aborted a request.'));
            });
          }
        }),
      );

      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        rawRequest: mockRawRequest,
      }));

      await expect(apiClient.rawRequest(query, undefined, { timeout: 50 })).rejects.toThrow('Request timed out after 50ms');
    });

    it('should successfully complete rawRequest without timeout', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';
      const expectedResponse = {
        data: { users: [{ id: 1, name: 'John' }] },
        status: 200,
        headers: new Headers(),
      };

      const mockRawRequest = jest.fn().mockResolvedValue(expectedResponse);
      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        rawRequest: mockRawRequest,
      }));

      const result = await apiClient.rawRequest(query);

      expect(result).toEqual(expectedResponse);
      expect(mockRawRequest).toHaveBeenCalledWith(query, undefined);
    });

    it('should pass through other errors even when timeout is set', async () => {
      const token = 'test-token';
      const apiClient = new ApiClient({ token });
      const query = '{ users { id name } }';
      const customError = new Error('GraphQL Error');

      const mockRawRequest = jest.fn().mockRejectedValue(customError);
      (GraphQLClient as jest.Mock).mockImplementation(() => ({
        rawRequest: mockRawRequest,
      }));

      await expect(apiClient.rawRequest(query, undefined, { timeout: 5000 })).rejects.toThrow('GraphQL Error');
    });
  });
});
