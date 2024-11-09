# Monday GraphQL JS SDK

## Introduction

The monday api SDK provides a simple way to interact with monday.com's GraphQL platform API, making it easier than ever to get started with our API.
The SDK abstracts away the complex GraphQL queries, providing simple operations for the most common endpoints such as fetching board data, or creating items.

The SDK is supported in both Node.js and browser environments, and is using the [graphql-request client](https://www.npmjs.com/package/graphql-request) under the hood.

Want to make more complex queries or find out more about what our API has to offer, check out [monday.com's API documentation](https://developer.monday.com/api-reference).

If your code operates within a browser-based app deployed on monday.com, you can utilize the **SeamlessApiClient** class which does not require specifying the user's token. For all other scenarios, use the **ApiClient** class.

## Installation

```bash
npm install @mondaydotcomorg/api
```

## Important

All exported types correspond to the current version of the API that existed when the NPM package was released

For the convenience of monday app developers, this CLI is included in the [@mondaydotcomorg/apps-cli](https://www.npmjs.com/package/@mondaycom/apps-cli).
If you want to use it on it’s own, you can install [@mondaydotcomorg/setup-api](https://www.npmjs.com/package/@mondaydotcomorg/setup-api).
(you can find more about app development here [monday-apps-sdk](https://developer.monday.com/apps/docs/introduction-to-the-sdk))

## Usage

### Using the api client

The package exports the class `ApiClient` which is the main entry point to the SDK. You can use it to query monday's API freestyle, or use the operations provided by the SDK.

```typescript
import { ApiClient } from '@mondaydotcomorg/api';

const client = new ApiClient({token: '<API-TOKEN>'});

// Or use the operations provided by the SDK
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

// Use the client to query monday's API freestyle WITHOUT TYPES -> Use @mondaydotcomorg/setup-api to setup typed project!
const boards = await client.request<{boards: [{ name: string }]}>(`query { boards(ids: some_id) { name } }`);

// You can also use the types provided by the sdk 
const { boards } = await client.request<{
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

### Configuration

#### ErrorPolicy

By default GraphQLClient will throw when an error is received. However, sometimes you still want to resolve the (partial) data you received. You can define errorPolicy in the GraphQLClient constructor.

```typescript
const client = new ApiClient({token: '<API-TOKEN>', requestConfig: { errorPolicy: 'all' }});
```

**None (default)**
Allow no errors at all. If you receive a GraphQL error the client will throw.

**Ignore**
Ignore incoming errors and resolve like no errors occurred

**All**
Return both the errors and data, only works with the client's rawRequest call option.

### Handling errors

The errors are returned from the `ClientError` type.
**The example below is leveraging types using [@mondaydotcomorg/setup-api](https://www.npmjs.com/package/@mondaydotcomorg/setup-api).**

```typescript
import { ApiClient, ClientError } from "@mondaydotcomorg/api";
import { GetBoardsQuery, GetBoardsQueryVariables } from "./generated/graphql";
import { exampleQuery } from "./queries.graphql";

async function getBoardDetails(): Promise<void> {
  try {
    const token = "<API_TOKEN>";
    const client = new ApiClient({ token });
    const queryVariables: GetBoardsQueryVariables = { ids: ["5901934630"] };
    const queryData = await client.request<GetBoardsQuery>(
      exampleQuery,
      queryVariables
    );

    console.log(queryData.boards);
  } catch (error) {
    if (error instanceof ClientError) {
      console.error(error.response.errors);
    } else {
      console.error(error);
    }
  }
}

getBoardDetails();
```

### Other request options

If you prefer the 'old' style of response (data, errors, extensions) you can call the api using the rawRequest option
**The example below is leveraging types using [@mondaydotcomorg/setup-api](https://www.npmjs.com/package/@mondaydotcomorg/setup-api).**

```typescript
import { ApiClient, ClientError } from "@mondaydotcomorg/api";
import { GetBoardsQuery, GetBoardsQueryVariables } from "./generated/graphql";
import { exampleQuery } from "./queries.graphql";

async function getBoardDetails(): Promise<void> {
  try {
    const token = "<API_TOKEN>";
    const client = new ApiClient({ token });
    const queryVariables: GetBoardsQueryVariables = { ids: ["5901934630"] };
    const queryData = await client.rawRequest<GetBoardsQuery>(
      exampleQuery,
      queryVariables
    );

    console.log(queryData.data.boards);
  } catch (error) {
    if (error instanceof ClientError) {
      console.error(error.response.errors);
    } else {
      console.error(error);
    }
  }
}

getBoardDetails();
```

## SeamlessApiClient

The SeamlessApiClient class is a tool designed for making seamless API requests to Monday.com, tailored for use within the client side of applications deployed on the platform.
Basically, when you are making an api call from the client side of an app deployed on Monday.com, you don't need to specify the users token.

```typescript
import {
  Board,
} from "@mondaydotcomorg/api";

// Option A - using pre defined types
const seamlessApiClient = new SeamlessApiClient();
const { boards } = await client.request<{boards: [Board];}>(`query { boards(ids: some_id) { id name } }`);

// Option B - using your own types after integrating with @mondaydotcomorg/setup-api
import { GetBoardsQueryVariables, GetBoardsQuery } from "./generated/graphql";
const seamlessApiClient = new SeamlessApiClient();
const variables: GetBoardsQueryVariables = { ids: ["some_id"] };

export const getBoards = gql`
  query GetBoards($ids: [ID!]) {
    boards(ids: $ids) {
      id
      name
    }
  }
`;

try {
  const data = await seamlessApiClient.request<GetBoardsQuery>(getBoards, variables);
} catch (error) { 
  // If the error is from SeamlessApiClient, it will be of type SeamlessApiClientError, which you can import from our package. Also, error.type will also 'SeamlessApiClientError'.
  
  console.log(error.response.errors)
}
```

### Type support

note that after usage, you'l get all the available fields, with no regard to the fields you asked for

![alt text](https://github.com/mondaycom/monday-graphql-api/blob/main/packages/api/public/image.png)

**But there's a solution, look [here!](https://www.npmjs.com/package/@mondaydotcomorg/setup-api)**
