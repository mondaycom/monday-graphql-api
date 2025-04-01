#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerTools } from './tools/index.js';

/**
 * The main MCP server instance for the monday-api-mcp project
 */
export const mcp = new McpServer({
  name: 'monday-api-mcp',
  version: '1.0.0',
});

// Register all tools
registerTools(mcp);

/**
 * Initializes and starts the MCP server
 * Uses stdio for transport
 */
async function runServer() {
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  dotenv.config({ path: path.resolve(packageRoot, '.env') });

  const transport = new StdioServerTransport();

  await mcp.connect(transport);
  console.error('Monday API MCP Server running on stdio');
}
runServer().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
