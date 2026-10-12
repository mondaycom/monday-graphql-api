import { ApiClient } from '../api-client/api-client';

export interface ComplexityInfo {
  before: number;
  after: number;
  query: number;
  resetInSeconds: number;
}

/**
 * Extracts complexity information from a raw API response.
 * Use with `client.rawRequest()` to monitor your complexity budget.
 *
 * Usage:
 * ```ts
 * const response = await client.rawRequest(query, variables);
 * const complexity = getComplexityFromResponse(response);
 * if (complexity && complexity.after < 100) {
 *   // approaching limit, slow down
 * }
 * ```
 */
export function getComplexityFromResponse(response: { extensions?: Record<string, any> }): ComplexityInfo | null {
  const extensions = response?.extensions;
  if (!extensions?.complexity) return null;

  const c = extensions.complexity;
  return {
    before: c.before,
    after: c.after,
    query: c.query,
    resetInSeconds: c.reset_in_x_seconds,
  };
}

/**
 * Queries the current complexity budget without consuming much of it.
 * Returns the complexity info from the API.
 */
export async function getComplexityBudget(client: ApiClient): Promise<ComplexityInfo | null> {
  const response = await client.rawRequest<{ complexity: any }>(
    `query { complexity { before after query reset_in_x_seconds } }`,
  );
  const data = response.data?.complexity;
  if (!data) return null;
  return {
    before: data.before,
    after: data.after,
    query: data.query,
    resetInSeconds: data.reset_in_x_seconds,
  };
}
