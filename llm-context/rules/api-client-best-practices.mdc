---
description: Use these rules when making API calls to the monday.com GraphQL API. Best practices for using the monday API client, making requests and handling errors. 
globs: 
alwaysApply: false
---
# Using monday.com API Client Libraries

## Overview
This guide explains how to use the official monday.com API client libraries to make GraphQL API calls. The client libraries provide type-safe, reliable methods for interacting with the monday.com API.

## Using monday client libraries to make GraphQL API calls

- Use the `@mondaydotcomorg/api` package to call the monday API
- Read the client documentation at @https://www.npmjs.com/package/@mondaydotcomorg/api
- Prefer the `@mondaydotcomorg/api` package over the "monday-sdk-js" package for making API calls

### Installing the API client
- If `@mondaydotcomorg/api` is not in the project dependencies, install it:
```bash
npm install @mondaydotcomorg/api
```

### Using the API client
- Use the `ApiClient` class to make API calls from the server-side, such as Node.js environments. 
- Use the `SeamlessApiClient` class to make API calls from the client-side, such as in React environments. 

## Installation and Setup

### Installing the API Client
```bash
npm install @mondaydotcomorg/api
```

### Required Imports
```typescript
import { ApiClient, SeamlessApiClient } from "@mondaydotcomorg/api";
```

## Type Definitions

```typescript
// Base response type for all API calls
type APIResponse<T> = {
    loading: boolean;                 // Top-level loading state
    error: APIError | null;          // Top-level errors
    data: {
        loading: boolean;            // Query-specific loading state
        error: APIError | null;      // Query-specific errors
        data: T;                     // Your query results
    };
}

// Structured error type
type APIError = {
    message: string;
    status: number;
    errors?: Array<{
        message: string;
        path?: string[];
    }>;
}
```


## Error Handling Best Practices

1. **Always check both levels of errors**
```typescript
if (error instanceof ClientError) {
    console.error(error.response.errors);
} else {
    console.error(error);
}
```

2. **Use try-catch blocks**
```typescript
try {
    const response = await client.request(query);
    // Handle success
} catch (error) {
    // Handle network errors, parsing errors, etc.
}
```

## Important Notes

1. **API Token Security**
   - Never hardcode API tokens in your code
   - Use environment variables for API tokens
   - Backend: Use `process.env.MONDAY_API_TOKEN`
   - Frontend: The SeamlessApiClient handles authentication automatically
2. **API Version Compatibility**
   - Always pass an API version
   - Check monday API release notes for updates: @https://developer.monday.com/api-reference/docs/release-notes

3. **Rate Limiting**
   - Implement appropriate error handling for rate limit responses
   - Consider implementing retry logic with exponential backoff

4. **Performance Tips**
   - Request only the fields you need
   - Use pagination for large datasets
   - Cache responses when appropriate