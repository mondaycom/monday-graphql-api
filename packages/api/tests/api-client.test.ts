import { GraphQLClient } from 'graphql-request';
import { ApiClient } from '../lib/api-client';
import pkg from '../package.json';
import { DEFAULT_VERSION } from '../lib/constants';
import { TEST_TOKEN } from './test-utils';

jest.mock('graphql-request', () => {
  return {
    GraphQLClient: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockResolvedValue({}),
        rawRequest: jest.fn().mockResolvedValue({ data: {}, headers: new Map(), status: 200 }),
      };
    }),
  };
});

describe('ApiClient', () => {
  it('should correctly initialize with default parameters', () => {
    const apiClient = new ApiClient({ token: TEST_TOKEN });

    expect(GraphQLClient).toHaveBeenCalledWith('https://api.monday.com/v2', expect.objectContaining({
      headers: {
        'Content-Type': 'application/json',
        Authorization: TEST_TOKEN,
        'API-Version': DEFAULT_VERSION,
        'Api-Sdk-Version': pkg.version,
      },
    }));

    expect(apiClient.operations).toBeDefined();
  });

  describe('constructor apiVersion validation', () => {
    it('should throw error for invalid month in apiVersion', () => {
      expect(() => new ApiClient({ token: TEST_TOKEN, apiVersion: '2024-03' })).toThrow(
        "Invalid API version format. Expected format is 'yyyy-mm' with month as one of '01', '04', '07', or '10'.",
      );
    });

    it('should throw error for malformed apiVersion format', () => {
      expect(() => new ApiClient({ token: TEST_TOKEN, apiVersion: 'invalid' })).toThrow(
        "Invalid API version format. Expected format is 'yyyy-mm' with month as one of '01', '04', '07', or '10'.",
      );
    });

    it('should throw error for apiVersion with extra characters', () => {
      expect(() => new ApiClient({ token: TEST_TOKEN, apiVersion: '2024-01-01' })).toThrow(
        "Invalid API version format. Expected format is 'yyyy-mm' with month as one of '01', '04', '07', or '10'.",
      );
    });

    it.each(['2024-01', '2024-04', '2024-07', '2024-10', 'dev'])(
      'should accept valid apiVersion: %s',
      (apiVersion) => {
        expect(() => new ApiClient({ token: TEST_TOKEN, apiVersion })).not.toThrow();
      },
    );
  });

  // rawRequest() is using same validation so it's covered by the same tests
  describe('request() options validation', () => {
    let apiClient: ApiClient;

    beforeEach(() => {
      apiClient = new ApiClient({ token: TEST_TOKEN });
    });

    describe('versionOverride validation', () => {
      it('should reject invalid month in versionOverride', async () => {
        await expect(
          apiClient.request('query { me { id } }', {}, { versionOverride: '2024-02' }),
        ).rejects.toThrow();
      });

      it('should reject malformed versionOverride format', async () => {
        await expect(
          apiClient.request('query { me { id } }', {}, { versionOverride: 'invalid-version' }),
        ).rejects.toThrow();
      });

      it('should reject empty string versionOverride', async () => {
        await expect(
          apiClient.request('query { me { id } }', {}, { versionOverride: '' }),
        ).rejects.toThrow();
      });

      it('should accept valid quarterly versionOverride', async () => {
        await expect(
          apiClient.request('query { me { id } }', {}, { versionOverride: '2024-04' }),
        ).resolves.not.toThrow();
      });

      it('should accept "dev" as valid versionOverride', async () => {
        await expect(
          apiClient.request('query { me { id } }', {}, { versionOverride: 'dev' }),
        ).resolves.not.toThrow();
      });

      it('should accept no versionOverride', async () => {
        await expect(apiClient.request('query { me { id } }', {}, { versionOverride: undefined })).resolves.not.toThrow();
      });
    });

    describe('timeout validation', () => {
      it('should reject negative timeout', async () => {
        await expect(apiClient.request('query { me { id } }', {}, { timeoutMs: -1000 })).rejects.toThrow();
      });

      it('should reject zero timeout', async () => {
        await expect(apiClient.request('query { me { id } }', {}, { timeoutMs: 0 })).rejects.toThrow();
      });

      it('should accept positive timeout', async () => {
        await expect(apiClient.request('query { me { id } }', {}, { timeoutMs: 5000 })).resolves.not.toThrow();
      });

      it('should accept no timeout', async () => {
        await expect(apiClient.request('query { me { id } }', {}, { timeoutMs: undefined })).resolves.not.toThrow();
      });
    });

    describe('headers validation', () => {
      it('should reject non-string header values', async () => {
        await expect(
          apiClient.request('query { me { id } }', {}, { headers: { 'X-Custom': 1 as unknown as string } }),
        ).rejects.toThrow();
      });

      it('should accept string header values', async () => {
        await expect(
          apiClient.request('query { me { id } }', {}, { headers: { 'X-Custom': 'value' } }),
        ).resolves.not.toThrow();
      });
    });

    describe('idempotencyKey validation', () => {
      it('should reject empty idempotencyKey', async () => {
        await expect(apiClient.request('mutation { x }', {}, { idempotencyKey: '' })).rejects.toThrow();
      });

      it('should accept non-empty idempotencyKey', async () => {
        await expect(apiClient.request('mutation { x }', {}, { idempotencyKey: 'key-1' })).resolves.not.toThrow();
      });
    });

    it('should accept empty options object', async () => {
      await expect(apiClient.request('query { me { id } }', {}, {})).resolves.not.toThrow();
    });
    it('should accept undefined options', async () => {
      await expect(apiClient.request('query { me { id } }', {}, undefined)).resolves.not.toThrow();
    });
  });

  describe('per-request headers', () => {
    const lastClientHeaders = () => {
      const calls = (GraphQLClient as unknown as jest.Mock).mock.calls;
      return calls[calls.length - 1][1].headers;
    };

    it('should send per-request headers with request()', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN });
      await apiClient.request('mutation { x }', {}, { headers: { 'X-Custom': 'value' } });

      expect(lastClientHeaders()).toEqual(expect.objectContaining({ 'X-Custom': 'value', Authorization: TEST_TOKEN }));
    });

    it('should send per-request headers with rawRequest()', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN });
      await apiClient.rawRequest('mutation { x }', {}, { headers: { 'X-Custom': 'value' } });

      expect(lastClientHeaders()).toEqual(expect.objectContaining({ 'X-Custom': 'value' }));
    });

    it('should override requestConfig headers', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN, requestConfig: { headers: { 'X-Custom': 'config' } } });
      await apiClient.request('mutation { x }', {}, { headers: { 'X-Custom': 'request' } });

      expect(lastClientHeaders()['X-Custom']).toBe('request');
    });

    it('should not leak headers into subsequent requests', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN });
      await apiClient.request('mutation { x }', {}, { headers: { 'X-Custom': 'value' } });
      await apiClient.request('query { me { id } }');

      expect(lastClientHeaders()).not.toHaveProperty('X-Custom');
    });

    it('should send idempotencyKey as Idempotency-Key header', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN });
      await apiClient.request('mutation { x }', {}, { idempotencyKey: 'key-1' });

      expect(lastClientHeaders()['Idempotency-Key']).toBe('key-1');
    });

    it('should send idempotencyKey with rawRequest()', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN });
      await apiClient.rawRequest('mutation { x }', {}, { idempotencyKey: 'key-1' });

      expect(lastClientHeaders()['Idempotency-Key']).toBe('key-1');
    });

    it('should prefer idempotencyKey over Idempotency-Key passed in headers', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN });
      await apiClient.request('mutation { x }', {}, {
        headers: { 'Idempotency-Key': 'from-headers' },
        idempotencyKey: 'from-option',
      });

      expect(lastClientHeaders()['Idempotency-Key']).toBe('from-option');
    });

    it('should not send Idempotency-Key header when idempotencyKey is not provided', async () => {
      const apiClient = new ApiClient({ token: TEST_TOKEN });
      await apiClient.request('mutation { x }', {}, { idempotencyKey: 'key-1' });
      await apiClient.request('mutation { x }');

      expect(lastClientHeaders()).not.toHaveProperty('Idempotency-Key');
    });
  });
});
