# Important

This will explain how to use our provided operations and their types to start working with the api
For now, all the exported types will correspond to the 2024-04 version, with no regard to the version you specify

If you need a different version OR When you'l want to write your own TYPED queries, you have two options:

1. If you aren't a monday app developer, use @mondaydotcomorg/setup-api
2. If you are a monday app developer, use @mondaydotcomorg/apps-cli in your app root directory, and choose the api:generate option

## Monday GraphQL JS SDK

This SDK provides you with an easy way to interact with monday.com's GraphQL API.
The SDK is supported in both Node.js and browser environments, and is using the [graphql-request client](https://www.npmjs.com/package/graphql-request) under the hood.

## Installation

```bash
npm install @mondaydotcomorg/api
```

## Usage

### Using the api client

The package exports the class `ApiClient` which is the main entry point to the SDK. You can use it to query monday's API freestyle, or use the operations provided by the SDK.

```typescript
import { ApiClient } from '@mondaydotcomorg/api';

const client = new ApiClient('<API-TOKEN>');

// or use the operations provided by the SDK
const me = await client.operations.getMeOp();

// Example how to change a text column
const changeTextColumn = await client.operations.changeColumnValueOp({
    boardId: "your_board_id",
    itemId: "your_item_id",
    columnId: "text",
    value: JSON.stringify("Hello, world!"),
});

// Example how to change a status column
const changeStatusColumn = await client.operations.changeColumnValueOp({
    boardId: "your_board_id",
    itemId: "your_item_id",
    columnId: "project_status", // replace with your column id
    value: JSON.stringify({ label: "Done" }),
});

// use the client to query monday's API freestyle WITHOUT TYPES -> Use @mondaydotcomorg/setup-api to setup typed project!
const boards = await client.query<{boards: [{ name: string }]}>(`query { boards(ids: some_id) { name } }`);

// You can also use the types provided by the sdk 
const { boards } = await client.query<{
  boards: [Board];
}>(`query { boards(ids: some_id) { name } }`);
```

### Using the types

The package exports all the types used by the SDK, so you can use them in your code.

```typescript
import { User } from '@mondaydotcomorg/api';

const user: User = {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@someorg.com'
}
```
