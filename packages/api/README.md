# Monday GraphQL JS SDK

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

// use the client to query monday's API freestyle
const boards = await client.query<{ boards: [{ name: string }] }>(`query { boards(ids: 3670909828) { name } }`);

// or use the operations provided by the SDK
const me = await client.operations.getMe();
```

### Using the types

The package exports all the types used by the SDK, so you can use them in your code.

```typescript
import type { User } from '@mondaycom/api';

const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@someorg.com',
};
```