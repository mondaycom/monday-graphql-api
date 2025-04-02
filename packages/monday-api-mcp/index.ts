#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MondayAgentToolkit } from '@mondaydotcomorg/agent-toolkit/mcp';
import { registerTools } from './tools/index.js';

/**
 * Initializes and starts the MCP server with the Monday Agent Toolkit
 * Uses stdio for transport
 */

// export const mcp = new McpServer({
//   name: 'monday-api-mcp',
//   version: '1.0.0',
// });

// // Register all tools
// registerTools(mcp);

async function runServer() {
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  dotenv.config({ path: path.resolve(packageRoot, '.env') });

  const mondayApiToken = process.env.MONDAY_API_TOKEN;
  if (!mondayApiToken) {
    throw new Error('MONDAY_API_TOKEN environment variable is required');
  }

  const toolkit = new MondayAgentToolkit({
    mondayApiToken,
    mondayApiVersion: '2025-01',
    mondayApiRequestConfig: {},
  });

  // registerTools(toolkit);

  const transport = new StdioServerTransport();

  await toolkit.connect(transport);
  console.error('Monday Agent Toolkit MCP Server running on stdio');
}

runServer().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
