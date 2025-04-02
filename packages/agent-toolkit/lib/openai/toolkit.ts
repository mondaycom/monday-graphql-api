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
import { BaseMondayApiTool } from '../core/base-monday-api-tool';

export type MondayAgentToolkitConfig = {
  mondayApiToken: ApiClientConfig['token'];
  mondayApiVersion: ApiClientConfig['apiVersion'];
  mondayApiRequestConfig: ApiClientConfig['requestConfig'];
  toolsConfiguration?: ToolsConfiguration;
};

export class MondayAgentToolkit {
  private readonly mondayApi: ApiClient;
  tools: ChatCompletionTool[];

  constructor(config: MondayAgentToolkitConfig) {
    this.mondayApi = new ApiClient({
      token: config.mondayApiToken,
      apiVersion: config.mondayApiVersion,
      requestConfig: config.mondayApiRequestConfig,
    });

    const toolsToRegister = filterTools(allTools, this.mondayApi, config.toolsConfiguration);
    const toolInstances = toolsToRegister.map((tool) => new tool(this.mondayApi));

    this.tools = toolInstances.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: zodToJsonSchema(z.object(tool.inputSchema)),
      },
    }));
  }

  getTools(): ChatCompletionTool[] {
    return this.tools;
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

    const toolInstance = this.tools.find((t) => t.function.name === name);
    if (!toolInstance) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const toolClass = allTools.find((t) => new t(this.mondayApi).name === name);
    if (!toolClass) {
      throw new Error(`Tool class not found: ${name}`);
    }

    const tool = new toolClass(this.mondayApi) as BaseMondayApiTool<any>;
    const parsedResult = z.object(tool.inputSchema).safeParse(args);
    if (!parsedResult.success) {
      // TODO: log error?
      throw new Error(`Invalid arguments: ${parsedResult.error.message}`);
    }

    const result = await tool.execute(parsedResult.data);

    return {
      role: 'tool',
      tool_call_id: toolCall.id,
      content: result,
    } as ChatCompletionToolMessageParam;
  }
}
