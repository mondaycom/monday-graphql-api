---
description: Backend code examples for the official monday.com API client library. Use these rules when making GraphQL queries in a server-side environment. 
globs: 
alwaysApply: false
---
## Backend Usage (Node.js Environment)

The following examples show correct usage of the monday API client in a backend environment, such as NodeJS or in server-side code for NextJS or React. 

### Basic Mutation Example
```typescript
import { ApiClient } from "@mondaydotcomorg/api";

// Define your mutation types
type CreateItemResponse = {
    create_item: {
        id: string;
        name: string;
    };
}

// Define your GraphQL mutation
const CREATE_ITEM = `
    mutation($boardId: ID!, $itemName: String!) {
        create_item(
            board_id: $boardId,
            item_name: $itemName
        ) {
            id
            name
        }
    }
`;

// Make the API call
async function createNewItem(boardId: string, itemName: string) {
    // Get your API token from environment variables
    const API_TOKEN = process.env.MONDAY_API_TOKEN;
    if (!API_TOKEN) {
        throw new Error('API token not found in environment variables');
    }

    const client = new ApiClient({ token: API_TOKEN, apiVersion: "2025-04"});
    
    try {
        const response = await client.request<APIResponse<CreateItemResponse>>(
            CREATE_ITEM,
            {
                variables: {
                    boardId,
                    itemName
                }
            }
        );

        if (response.error || response.data.error) {
            throw new Error(response.error?.message || response.data.error?.message);
        }

        return response.data.data;
    } catch (error) {
        console.error('Failed to create item:', error);
        throw error;
    }
}
```

## Correct error handling example

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
