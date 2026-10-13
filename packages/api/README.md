# monday.com API SDK

A JavaScript/TypeScript client for [monday.com's GraphQL platform API](https://developer.monday.com/api-reference). It works in Node.js and in the browser, and uses [graphql-request](https://www.npmjs.com/package/graphql-request) under the hood.

The package has two clients:

- **`ApiClient`**: for everything that has an API token, such as scripts, servers and integrations.
- **`SeamlessApiClient`**: for the client side of an app deployed on monday.com. It needs no token, because it asks monday.com to make the call on behalf of the logged-in user.

## Installation

```bash
npm install @mondaydotcomorg/api
```

## ApiClient

```typescript
import { ApiClient } from '@mondaydotcomorg/api';

const client = new ApiClient({ token: '<API-TOKEN>' });

const { boards } = await client.request<{ boards: { name: string }[] }>(
  `query { boards(ids: 123) { name } }`,
);
```

`request()` resolves with the `data` of the GraphQL response, and rejects if the response has errors (see [Handling errors](#handling-errors)).

The constructor also takes `apiVersion` (defaults to the version matching your package release), `endpoint`, and `requestConfig`, which is passed on to graphql-request.

### Operations

For common tasks you don't have to write GraphQL yourself. The client ships with ready-made operations:

```typescript
const me = await client.operations.getMeOp();

// Change a text column
await client.operations.changeColumnValueOp({
  boardId: 'your_board_id',
  itemId: 'your_item_id',
  columnId: 'text',
  value: JSON.stringify('Hello, world!'),
});

// Change a status column
await client.operations.changeColumnValueOp({
  boardId: 'your_board_id',
  itemId: 'your_item_id',
  columnId: 'project_status',
  value: JSON.stringify({ label: 'Done' }),
});
```

### Types

The package exports the types of the whole API, for example `Board` and `User`:

```typescript
import { Board } from '@mondaydotcomorg/api';

const { boards } = await client.request<{ boards: Board[] }>(
  `query { boards(ids: 123) { name } }`,
);
```

These types match the API version that was current when the package was released.

A type like `Board` describes every field, not just the ones in your query, so your editor will suggest fields the response doesn't have:

![All fields are suggested, whatever the query asks for](https://github.com/mondaycom/monday-graphql-api/blob/main/packages/api/public/image.png)

To get types that match each query exactly, use [@mondaydotcomorg/setup-api](https://www.npmjs.com/package/@mondaydotcomorg/setup-api). It generates them from your own queries. The same tool is bundled in [@mondaycom/apps-cli](https://www.npmjs.com/package/@mondaycom/apps-cli) for monday app developers (see the [monday apps SDK](https://developer.monday.com/apps/docs/introduction-to-the-sdk)).

### Request options

The third argument of `request()` sets options for that call only:

```typescript
await client.request(query, variables, {
  versionOverride: '2025-10', // use another API version for this call
  timeoutMs: 20_000, // up to 60 seconds
  headers: { 'X-Custom-Header': 'value' },
  idempotencyKey: '<UNIQUE-KEY>',
});
```

An idempotency key makes a mutation safe to retry. It is sent as the `Idempotency-Key` header, so reuse the same key when you retry the same operation. See the [idempotency docs](https://developer.monday.com/api-reference/docs/idempotency).

### Handling errors

When the response contains GraphQL errors, `request()` throws a `ClientError`:

```typescript
import { ApiClient, ClientError } from '@mondaydotcomorg/api';

try {
  await client.request(query, variables);
} catch (error) {
  if (error instanceof ClientError) {
    console.error(error.response.errors);
  } else {
    throw error;
  }
}
```

If you'd rather keep the partial data that did come back, set an `errorPolicy` on the client:

```typescript
const client = new ApiClient({ token: '<API-TOKEN>', requestConfig: { errorPolicy: 'all' } });
```

- `none` (default): throw on any GraphQL error.
- `ignore`: ignore the errors and resolve with the data.
- `all`: resolve with both data and errors. The errors are only visible through `rawRequest()`.

### rawRequest

`rawRequest()` returns the full response (`data`, `errors`, `extensions`, `headers` and `status`) instead of just the data:

```typescript
const res = await client.rawRequest<{ boards: Board[] }>(query, variables);

console.log(res.data.boards);
console.log(res.errors);
```

It takes the same options as `request()`.

### File uploads

Pass a `File` or `Blob` in the variables and the client sends a multipart request for you. This relies on the `File`, `Blob` and `fetch` that come with Node.js.

```typescript
const file = new File([Buffer.from('Hello World!')], 'test.txt', { type: 'text/plain' });

const result = await client.request(
  `mutation ($file: File!, $itemId: ID!, $columnId: String!) {
    add_file_to_column(file: $file, item_id: $itemId, column_id: $columnId) {
      id
      name
      url
    }
  }`,
  { file, itemId: 'your_item_id', columnId: 'files' },
);
```

## SeamlessApiClient

Use it in the browser code of an app deployed on monday.com. It sends the request to the monday.com page around your app, which makes the call as the current user, so there is no token to manage. It only works inside an app view on monday.com.

```typescript
import { SeamlessApiClient } from '@mondaydotcomorg/api';

const client = new SeamlessApiClient();

const res = await client.request<{ data: { data: { boards: { id: string; name: string }[] } } }>(
  `query { boards(ids: 123) { id name } }`,
);
const boards = res.data.data.boards;
```

The constructor takes an API version and client settings: `new SeamlessApiClient('2025-10', { errorPolicy: 'all' })`. Without a version it uses the one matching your package release.

### Response shape

Unlike `ApiClient`, `request()` doesn't return just the GraphQL data. It resolves with the whole reply from monday.com, so the fields you asked for are at `res.data.data`:

```typescript
{
  data: {
    data,        // the fields you queried
    extensions,
  },
  headers,       // a Headers object, if monday.com forwarded any (see below)
}
```

The type parameter of `request<T>()` describes this whole object.

### Request options

```typescript
await client.request(query, variables, {
  versionOverride: '2025-10',
  timeoutMs: 30_000, // default 60 seconds
  headers: { 'X-Custom-Header': 'value' },
  idempotencyKey: '<UNIQUE-KEY>',
  errorPolicy: 'all',
});
```

monday.com only forwards a set of allowed request headers and drops the rest. As with `ApiClient`, `idempotencyKey` is sent as the `Idempotency-Key` header and wins over one passed in `headers`.

The older positional form, `request(query, variables, version, timeout)`, still works but is deprecated.

### Handling errors

When the response contains GraphQL errors, `request()` rejects with a `SeamlessApiClientError`:

```typescript
import { SeamlessApiClient, SeamlessApiClientError } from '@mondaydotcomorg/api';

try {
  await client.request(query, variables);
} catch (error) {
  if (error instanceof SeamlessApiClientError) {
    console.error(error.response.errors);
    console.error(error.response.extensions?.request_id); // quote this when reporting a problem
  }
}
```

`error.response` has:

- `errors`: the GraphQL errors. The `message` of the error itself is always `'Graphql validation errors'`, so look at `errors[0].message` for the actual reason.
- `data`: the fields that did resolve, when monday.com forwards them.
- `extensions`: extra response details, such as `request_id`.
- `headers`: the forwarded response headers, if any.

Failures that aren't GraphQL errors (for example a missing query) also reject with a `SeamlessApiClientError`, but with `response.errors` undefined. A timeout rejects with a plain `Error`.

### errorPolicy

Like in `ApiClient`, you can resolve the partial data instead of rejecting. Set the policy on the client, or for one call with the `errorPolicy` request option, which wins over the client setting.

```typescript
const client = new SeamlessApiClient(undefined, { errorPolicy: 'all' });

// `me` works, `next_items_page` fails because the cursor is invalid
const res = await client.request('query { me { id } next_items_page(cursor: "invalid") { cursor } }');

res.data.data.me.id; // the field that resolved
res.data.errors; // the error of the field that failed
```

- `none` (default): reject with `SeamlessApiClientError`.
- `ignore`: resolve with `data` and `extensions`, and drop `errors`.
- `all`: resolve with `data`, `errors` and `extensions`.

The policy only applies to replies that contain GraphQL errors. Timeouts and other failures always reject. If monday.com doesn't forward the partial data, `res.data.data` is `undefined`.

### Response headers

When monday.com forwards response headers, they are on `res.headers` and `error.response.headers` as a standard `Headers` object, so lookups are case-insensitive:

```typescript
res.headers?.get('RateLimit');
```

Only `ratelimit`, `ratelimit-policy`, `api-version`, `x-request-id` and `retry-after` are forwarded. If none are, `headers` is `undefined`.

## Using an AI assistant

If an LLM helps you write code with this SDK, the rules in the `llm-context` package make it more likely to get it right. See the [LLM Context docs](https://github.com/mondaycom/monday-graphql-api/blob/main/packages/llm-context/README.md).
