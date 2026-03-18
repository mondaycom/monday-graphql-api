import { MockAgent, Interceptable } from 'undici';
import { ApiClient } from '../lib/api-client';
import { MONDAY_API_ENDPOINT } from '../lib/constants';

// Common test constants
export const TEST_TOKEN = 'test-token';
export const MONDAY_API_SUFFIX = '/v2';
export const MONDAY_API_ORIGIN = MONDAY_API_ENDPOINT.replace(MONDAY_API_SUFFIX, '');
export const JSON_HEADERS = { 'content-type': 'application/json' };

// Types
export interface CapturedRequest {
  body: any;
  headers: Record<string, string>;
}

export interface MockAgentContext {
  mockAgent: MockAgent;
  capturedRequest: CapturedRequest | null;
  setCapturedRequest: (req: CapturedRequest | null) => void;
}

/**
 * Creates a MockAgent context for integration tests.
 * Use with setupMockAgent in beforeEach and teardownMockAgent in afterEach.
 */
export function createMockAgentContext(): MockAgentContext {
  const context: MockAgentContext = {
    mockAgent: new MockAgent(),
    capturedRequest: null,
    setCapturedRequest: (req) => {
      context.capturedRequest = req;
    },
  };
  return context;
}

/**
 * Sets up the MockAgent for a test.
 * Call this in beforeEach.
 */
export function setupMockAgent(ctx: MockAgentContext): void {
  ctx.mockAgent = new MockAgent();
  ctx.mockAgent.disableNetConnect();
  ctx.capturedRequest = null;
}

/**
 * Tears down the MockAgent after a test.
 * Call this in afterEach.
 */
export async function teardownMockAgent(ctx: MockAgentContext): Promise<void> {
  await ctx.mockAgent.close();
}

/**
 * Creates an ApiClient with mocked fetch for integration testing.
 *
 * @param mockAgent - The MockAgent instance to use for intercepting requests
 * @param options - Optional configuration
 * @param options.captureRequest - Callback to capture request body and headers for assertions
 */
export function createMockedApiClient(
  mockAgent: MockAgent,
  options?: {
    captureRequest?: (req: CapturedRequest) => void;
  },
): ApiClient {
  const mockedFetch = (async (input: any, init: any) => {
    if (options?.captureRequest) {
      options.captureRequest({
        body: init?.body,
        headers: init?.headers || {},
      });
    }
    return fetch(input, { ...init, dispatcher: mockAgent });
  }) as typeof fetch;

  return new ApiClient({
    token: TEST_TOKEN,
    requestConfig: { fetch: mockedFetch },
  });
}

export interface MockGraphQLResponseOptions {
  delay?: number;
  status?: number;
}

/**
 * Sets up a mock GraphQL response for the Monday API endpoint.
 *
 * @param mockAgent - The MockAgent instance
 * @param data - The data to return in the response (will be wrapped in { data: ... })
 * @param options - Optional configuration for delay and status code
 * @returns The mock pool for additional configuration if needed
 */
export function mockGraphQLResponse(
  mockAgent: MockAgent,
  data: Record<string, any>,
  options?: MockGraphQLResponseOptions,
): Interceptable {
  const mockPool = mockAgent.get(MONDAY_API_ORIGIN);
  const interceptor = mockPool
    .intercept({ path: MONDAY_API_SUFFIX, method: 'POST' })
    .reply(options?.status ?? 200, { data }, { headers: JSON_HEADERS });

  if (options?.delay) {
    interceptor.delay(options.delay);
  }

  return mockPool;
}
