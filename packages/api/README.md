# Important

This will explain how to use our provided operations and their types to start working with the api
All the exported types will correspond to the stable version, with no regard to the version you specify
If you need a different version OR When you'l want to write your own TYPED queries - go to @mondaycom/setup-api to get your environemt ready with examples!

## Monday GraphQL JS SDK

This SDK provides you with an easy way to interact with monday.com's GraphQL API.
The SDK is supported in both Node.js and browser environments, and is using the [graphql-request client](https://www.npmjs.com/package/graphql-request) under the hood.

## Installation

```bash
npm install @mondaycom/api
```

## Usage

### Using the api client

The package exports the class `ApiClient` which is the main entry point to the SDK. You can use it to query monday's API freestyle, or use the operations provided by the SDK.

```typescript
import { ApiClient } from '@mondaycom/api';

const client = new ApiClient('<API-TOKEN>');

// or use the operations provided by the SDK
const me = await client.operations._getMe();

// Example how to change a text column
const changeTextColumn = await client.operations._ChangeColumnValue({
    boardId: "your_board_id",
    itemId: "your_item_id",
    columnId: "text",
    value: JSON.stringify("Hello, world!"),
});

// Example how to change a status column
const changeStatusColumn = await client.operations._ChangeColumnValue({
    boardId: "your_board_id",
    itemId: "your_item_id",
    columnId: "project_status", // replace with your column id
    value: JSON.stringify({ label: "Done" }),
});

// use the client to query monday's API freestyle WITHOUT TYPES -> Use @mondaycom/setup-api to setup typed project!
const boards = await client.query<{boards: [{ name: string }]}>(`query { boards(ids: some_id) { name } }`);

// You can also use the types provided by the sdk 
const { boards } = await client.query<{
  boards: [Board];
}>(`query { boards(ids: some_id) { name } }`);
```

### Using the types

The package exports all the types used by the SDK, so you can use them in your code.

```typescript
import { User } from '@mondaycom/api';

const user: User = {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@someorg.com'
}
```
