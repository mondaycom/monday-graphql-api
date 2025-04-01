import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCreateItemTool } from './create-item-tool.js';

/**
 * Registers all MCP tools with the provided MCP server instance
 * Note: The monday-docs-search-tool is available but not registered by default
 * @param mcp - The MCP server instance to register the tools with
 */
export const registerTools = (mcp: McpServer) => {
  registerCreateItemTool(mcp);
};
