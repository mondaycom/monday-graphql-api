# Monday.com API MCP Server

A server implementation for the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) that provides an interface to interact with Monday.com API.

## Usage

```bash
@mondaydotcomorg/monday-api-mcp -t abcd123
```

The Monday API token can also be provided via the `monday_token` environment variable.

### Command Line Arguments

| Argument | Flags | Description | Required | Default |
|----------|-------|-------------|----------|---------|
| Monday API Token | `--token`, `-t` | Monday.com API token (can also be provided via `monday_token` environment variable) | Yes | - |
| API Version | `--version`, `-v` | Monday.com API version | No | `current` |
| Read Only Mode | `--read-only`, `-ro` | Enable read-only mode | No | `false` |
| Dynamic API Tools | `--enable-dynamic-api-tools`, `-edat` | (Beta) Enable dynamic API tools (Mode that includes the whole API schema, not supported when using read-only mode) | No | `false` |

## Example Integration with Cursor

```json
{
  "mcpServers": {
    "monday-api-mcp": {
      "command": "npx",
      "args": [
        "@mondaydotcomorg/monday-api-mcp -t abcd123"
      ],
      "env": {}
    }
  }
}
```

### Example Integration with Claude Desktop

```json
{
  "mcpServers": {
    "monday-api-mcp": {
      "command": "npx",
      "args": [
        "@mondaydotcomorg/monday-api-mcp",
        "-t",
        "abcd123"
      ]
    }
  }
}
```

### Example Using Environment Variable

```json
{
  "mcpServers": {
    "monday-api-mcp": {
      "command": "npx",
      "args": [
        "@mondaydotcomorg/monday-api-mcp"
      ],
      "env": {
        "monday_token": "abcd123"
      }
    }
  }
}
```

## License

MIT
