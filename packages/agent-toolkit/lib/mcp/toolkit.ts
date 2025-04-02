import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ApiClient, ApiClientConfig } from '@mondaydotcomorg/api';
import { allTools } from '../tools';

export type MondayAgentToolkitConfig = {
  mondayApiToken: ApiClientConfig['token'];
  mondayApiVersion: ApiClientConfig['apiVersion'];
  mondayApiRequestConfig: ApiClientConfig['requestConfig'];
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

    const tools = allTools.map((tool) => new tool(this.mondayApiClient));

    tools.forEach((tool) => {
      this.tool(tool.name, tool.description, tool.inputSchema, async (args: any, _extra: any) => {
        const res = await tool.execute(args);

        return {
          content: [{ type: 'text' as const, text: res }],
        };
      });
    });
  }
}
