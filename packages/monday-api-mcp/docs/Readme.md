# MCP Server for Monday.com API

## Usage

### With npx

```bash
npx @mondaydotcomorg/monday-api-mcp --token YOUR_MONDAY_API_TOKEN
```

Or using the short flag:

```bash
npx @mondaydotcomorg/monday-api-mcp -t YOUR_MONDAY_API_TOKEN
```

### Environment Variable

Alternatively, you can set the token via environment variable:

```bash
export MONDAY_API_TOKEN=YOUR_MONDAY_API_TOKEN
npx @mondaydotcomorg/monday-api-mcp
```

## Debugging

View logs with:

```bash
tail -n 20 -F ~/Library/Application\ Support/Cursor/**/*MCP.log
```
