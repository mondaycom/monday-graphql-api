import { ApiClient, ApiClientConfig } from '@mondaydotcomorg/api';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type {
  ChatCompletionTool,
  ChatCompletionMessageToolCall,
  ChatCompletionToolMessageParam,
} from 'openai/resources';
import { z } from 'zod';
import { DeleteItemTool } from '../tools';

export type MondayAgentToolkitConfig = {
  mondayApiToken: ApiClientConfig['token'];
  mondayApiVersion: ApiClientConfig['apiVersion'];
  mondayApiRequestConfig: ApiClientConfig['requestConfig'];
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

    const tools = [new DeleteItemTool(this.mondayApi)];

    this.tools = tools.map((tool) => ({
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
    if (name !== 'deleteItem') {
      // TODO: log error?
      throw new Error(`Unknown tool: ${name}`);
    }

    const args = JSON.parse(stringifiedArgs);
    const tool = new DeleteItemTool(this.mondayApi);

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
