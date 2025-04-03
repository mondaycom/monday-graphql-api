# Monday.com API MCP Server

A server implementation for the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) that provides an interface to interact with Monday.com API.

## Usage

```bash
@mondaydotcomorg/monday-api-mcp -t abcd123
```

### Command Line Arguments

| Argument | Flags | Description | Required | Default |
|----------|-------|-------------|----------|---------|
| Monday API Token | `--token`, `-t` | Monday.com API token | Yes | - |
| API Version | `--version`, `-v` | Monday.com API version | No | `current` |
| Read Only Mode | `--read-only`, `-ro` | Enable read-only mode | No | `false` |
| Disable All API | `--disable-all-api-mode`, `-da` | Disable all API mode (Mode that includes the whole API schema) | No | `false` |

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

## License

MIT 