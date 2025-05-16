---
description: Use these rules when making GraphQL queries in a client-side or browser environment. Frontend code examples for the official monday.com API client library. 
globs: 
alwaysApply: false
---
## Frontend Usage (Browser Environment)

The following examples show correct usage of the monday API client in a frontend browser environment. 

### Basic Query Example
```typescript
import { SeamlessApiClient } from "@mondaydotcomorg/api";

// Define your query types
type UserData = {
    me: {
        name: string;
        email: string;
    };
}

// Define your GraphQL query
const GET_USER_INFO = `
    query {
        me {
            name
            email
        }
    }
`;

// Make the API call
async function getUserInfo() {
    const client = new SeamlessApiClient();
    try {
        const response = await client.request<APIResponse<UserData>>(GET_USER_INFO);
        
        if (response.error || response.data.error) {
            throw new Error(response.error?.message || response.data.error?.message);
        }
        
        return response.data.data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
```