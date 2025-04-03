import { ApiClient, ApiClientConfig } from '@mondaydotcomorg/api';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type {
  ChatCompletionTool,
  ChatCompletionMessageToolCall,
  ChatCompletionToolMessageParam,
} from 'openai/resources';
import { z } from 'zod';
import { allTools } from '../tools';
import { filterTools, ToolsConfiguration } from '../tools/utils';
import { Tool } from '../core/tool';

export type MondayAgentToolkitConfig = {
  mondayApiToken: ApiClientConfig['token'];
  mondayApiVersion: ApiClientConfig['apiVersion'];
  mondayApiRequestConfig: ApiClientConfig['requestConfig'];
  toolsConfiguration?: ToolsConfiguration;
};

export class MondayAgentToolkit {
  private readonly mondayApi: ApiClient;
  tools: Tool<any, any>[];

  constructor(config: MondayAgentToolkitConfig) {
    this.mondayApi = new ApiClient({
      token: config.mondayApiToken,
      apiVersion: config.mondayApiVersion,
      requestConfig: config.mondayApiRequestConfig,
    });

    const toolsToRegister = filterTools(allTools, this.mondayApi, config.toolsConfiguration);
    this.tools = toolsToRegister.map((tool) => new tool(this.mondayApi)) as Tool<any, any>[];
  }

  /**
   * Returns the tools that are available to be used in the OpenAI API.
   *
   * @returns {ChatCompletionTool[]} The tools that are available to be used in the OpenAI API.
   */
  getTools(): ChatCompletionTool[] {
    return this.tools.map((tool) => {
      const inputSchema = tool.getInputSchema();
      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.getDescription(),
          parameters: inputSchema ? zodToJsonSchema(z.object(inputSchema)) : undefined,
        },
      };
    });
  }

  /**
   * Processes a single OpenAI tool call by executing the requested function.
   *
   * @param {ChatCompletionMessageToolCall} toolCall - The tool call object from OpenAI containing
   *   function name, arguments, and ID.
   * @returns {Promise<ChatCompletionToolMessageParam>} A promise that resolves to a tool message
   *   object containing the result of the tool execution with the proper format for the OpenAI API.
   */
  async handleToolCall(toolCall: ChatCompletionMessageToolCall) {
    const { name, arguments: stringifiedArgs } = toolCall.function;
    const args = JSON.parse(stringifiedArgs);

    const tool = this.tools.find((t) => t.name === name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const parsedResult = z.object(tool.getInputSchema()).safeParse(args);
    if (!parsedResult.success) {
      // TODO: log error?
      throw new Error(`Invalid arguments: ${parsedResult.error.message}`);
    }

    const result = await tool.execute(parsedResult.data);

    return {
      role: 'tool',
      tool_call_id: toolCall.id,
      content: result.content,
    } as ChatCompletionToolMessageParam;
  }
}
