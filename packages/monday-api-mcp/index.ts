#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MondayAgentToolkit } from '@mondaydotcomorg/agent-toolkit/mcp';
import { parseArgs, validateArgs } from './utils/args/args.service.js';

/**
 * Initializes and starts the MCP server with the Monday Agent Toolkit
 * Uses stdio for transport
 */

async function runServer() {
  const args = process.argv.slice(2);
  const parsedArgs = parseArgs(args);
  const validatedArgs = validateArgs(parsedArgs);

  const toolkit = new MondayAgentToolkit({
    mondayApiToken: validatedArgs.token,
    mondayApiVersion: validatedArgs.version,
    mondayApiRequestConfig: {},
    toolsConfiguration: {
      readOnlyMode: validatedArgs.readOnlyMode,
      disableAllApi: validatedArgs.disableAllApiMode,
    },
  });

  const transport = new StdioServerTransport();

  await toolkit.connect(transport);
  console.info('Monday Agent Toolkit MCP Server running on stdio');
}

runServer().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
