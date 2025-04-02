import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApiClient, ApiClientConfig } from '@mondaydotcomorg/api';
import { allTools } from '../tools';
import { filterTools, ToolsConfiguration } from '../tools/utils';
import { CallToolResult } from '@modelcontextprotocol/sdk/types';

export type MondayAgentToolkitConfig = {
  mondayApiToken: ApiClientConfig['token'];
  mondayApiVersion: ApiClientConfig['apiVersion'];
  mondayApiRequestConfig: ApiClientConfig['requestConfig'];
  toolsConfiguration?: ToolsConfiguration;
};

export class MondayAgentToolkit extends McpServer {
  private readonly mondayApiClient: ApiClient;

  constructor(config: MondayAgentToolkitConfig) {
    super({
      name: 'monday.com',
      version: '1.0.0',
    });

    this.mondayApiClient = new ApiClient({
      token: config.mondayApiToken,
      apiVersion: config.mondayApiVersion,
      requestConfig: config.mondayApiRequestConfig,
    });

    const toolsToRegister = filterTools(allTools, this.mondayApiClient, config.toolsConfiguration);
    const tools = toolsToRegister.map((tool) => new tool(this.mondayApiClient));

    tools.forEach((tool) => {
      this.tool(tool.name, tool.getDescription(), tool.getInputSchema(), async (args: any, _extra: any) => {
        const res = await tool.execute(args);

        const result: CallToolResult = {
          content: [{ type: 'text', text: res.content }],
        };

        return result;
      });
    });
  }
}
