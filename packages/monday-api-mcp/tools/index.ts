import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  registerMondayExecuteGraphQLTools,
  registerMondayGraphQLTools,
  registerMondayNaturalLanguageApiTool,
} from './monday-graphql-tool.js';

/**
 * Registers all MCP tools with the provided MCP server instance
 * Note: The monday-docs-search-tool is available but not registered by default
 * @param mcp - The MCP server instance to register the tools with
 */
export const registerTools = (mcp: McpServer) => {
  registerMondayGraphQLTools(mcp);
  registerMondayExecuteGraphQLTools(mcp);
  registerMondayNaturalLanguageApiTool(mcp);
};
