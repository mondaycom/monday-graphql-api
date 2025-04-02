# @mondaydotcomorg/agent-toolkit

A powerful toolkit for building AI agents that interact with the Monday.com API. This package provides a set of tools and utilities to help you create AI-powered integrations with Monday.com, supporting both OpenAI and Model Context Protocol (MCP) implementations.

## Installation

```bash
npm install @mondaydotcomorg/agent-toolkit
```

## Features

- OpenAI integration support
- Model Context Protocol (MCP) support
- Pre-built Monday.com API tools
- TypeScript support with full type definitions
- Modular architecture with subpath exports

## Subpath Exports

The package provides several modular components that can be imported separately:

- `@mondaydotcomorg/agent-toolkit/mcp` - MCP server implementation
- `@mondaydotcomorg/agent-toolkit/tools` - Monday.com API tools
- `@mondaydotcomorg/agent-toolkit/core` - Core utilities and base classes
- `@mondaydotcomorg/agent-toolkit/openai` - OpenAI integration

## Available Tools

The toolkit includes several pre-built tools for common Monday.com operations:

- Delete Item Tool
- Get Board Items Tool
- Create Item Tool
- Create Update Tool
- Get Board Schema Tool

## Usage

### OpenAI Integration

```typescript
import { MondayAgentToolkit } from '@mondaydotcomorg/agent-toolkit/openai';

const toolkit = new MondayAgentToolkit({
  mondayApiToken: 'your-monday-api-token',
  mondayApiVersion: 'your-api-version',
  mondayApiRequestConfig: {} // Optional request config
});

// Get tools for OpenAI
const tools = toolkit.getTools();

// Handle tool calls from OpenAI
await toolkit.handleToolCall(toolCall);
```

### MCP Integration

```typescript
import { MondayAgentToolkit } from '@mondaydotcomorg/agent-toolkit/mcp';

const toolkit = new MondayAgentToolkit({
  mondayApiToken: 'your-monday-api-token',
  mondayApiVersion: 'your-api-version',
  mondayApiRequestConfig: {} // Optional request config
});

// The toolkit extends McpServer and automatically registers all available tools
```

### Using Individual Tools

```typescript
import { CreateItemTool } from '@mondaydotcomorg/agent-toolkit/tools';
import { ApiClient } from '@mondaydotcomorg/api';

const apiClient = new ApiClient({
  token: 'your-monday-api-token',
  apiVersion: 'your-api-version'
});

const createItemTool = new CreateItemTool(apiClient);
await createItemTool.execute(/* tool input */);
```

## Requirements

- Node.js >= 16.20.0
- Monday.com API token
- OpenAI API key (if using OpenAI integration)

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Format code
npm run prettier

# Lint code
npm run lint

# Watch mode during development
npm run watch

# Update Monday.com GraphQL schema
npm run fetch:schema

# Generate types from schema
npm run codegen

# Fetch schema and generate types
npm run fetch:generate
```

## License

MIT

## Author

monday.com API Team

## Repository

[GitHub Repository](https://github.com/mondaycom/monday-graphql-api/tree/main/packages/agent-toolkit)

## Keywords

- monday
- api
- agent-toolkit
- openai
- mcp
- ai-agents
