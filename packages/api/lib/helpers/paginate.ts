import { ApiClient } from '../api-client/api-client';

export interface PaginateOptions {
  limit?: number;
  timeoutMs?: number;
}

export interface ItemsPage<T> {
  cursor: string | null;
  items: T[];
}

/**
 * Async generator that auto-follows cursors from boards.items_page / next_items_page.
 * Yields one page of items at a time.
 *
 * Usage:
 * ```ts
 * for await (const page of paginateItems(client, boardId)) {
 *   for (const item of page) { ... }
 * }
 * ```
 */
export async function* paginateItems(
  client: ApiClient,
  boardId: string,
  options: PaginateOptions = {},
): AsyncGenerator<any[], void, undefined> {
  const limit = options.limit ?? 100;
  const reqOptions = options.timeoutMs ? { timeoutMs: options.timeoutMs } : undefined;

  const firstQuery = `
    query ($boardId: [ID!]!, $limit: Int!) {
      boards(ids: $boardId) {
        items_page(limit: $limit) {
          cursor
          items {
            id
            name
            column_values { id type text value }
          }
        }
      }
    }
  `;

  const firstResult = await client.request<{
    boards: Array<{ items_page: { cursor: string | null; items: any[] } }>;
  }>(firstQuery, { boardId: [boardId], limit }, reqOptions);

  const firstPage = firstResult.boards?.[0]?.items_page;
  if (!firstPage || firstPage.items.length === 0) return;

  yield firstPage.items;
  let cursor = firstPage.cursor;

  const nextQuery = `
    query ($cursor: String!, $limit: Int!) {
      next_items_page(cursor: $cursor, limit: $limit) {
        cursor
        items {
          id
          name
          column_values { id type text value }
        }
      }
    }
  `;

  while (cursor) {
    const result = await client.request<{
      next_items_page: { cursor: string | null; items: any[] };
    }>(nextQuery, { cursor, limit }, reqOptions);

    const page = result.next_items_page;
    if (!page || page.items.length === 0) return;

    yield page.items;
    cursor = page.cursor;
  }
}

/**
 * Convenience function that collects all items across all pages into a single array.
 * Use with caution on large boards — prefer the async generator for streaming.
 */
export async function getAllItems(
  client: ApiClient,
  boardId: string,
  options: PaginateOptions = {},
): Promise<any[]> {
  const allItems: any[] = [];
  for await (const page of paginateItems(client, boardId, options)) {
    allItems.push(...page);
  }
  return allItems;
}
