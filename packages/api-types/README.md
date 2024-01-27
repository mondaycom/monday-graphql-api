# Monday GraphQL TS Types
This SDK provides you with all the types needed to interact with monday.com's GraphQL API.
The SDK is supported in both Node.js and browser environments

## Installation
```bash
npm install @mondaycom/api-types
```

## Usage
The package exports all the types used by the SDK, so you can use them in your code.

```typescript
import type { User } from '@mondaycom/api';

const user: User = {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@someorg.com'
}
```
