import { ApiClient } from '@mondaydotcomorg/api';
import { Tool } from '../core/tool';
import { ToolType } from '../core/tool';
import { ZodRawShape } from 'zod';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';

export type ToolsConfiguration = {
  include?: string[];
  exclude?: string[];
  disableMutations?: boolean;
};

export function filterTools<T extends new (api: ApiClient) => BaseMondayApiTool<any>>(
  tools: T[],
  apiClient: ApiClient,
  config?: ToolsConfiguration,
): T[] {
  if (!config) {
    return tools;
  }

  let filteredTools = tools;

  if (config.include) {
    filteredTools = tools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return config.include?.includes(toolInstance.name);
    });
  } else if (config.exclude) {
    filteredTools = tools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return !config.exclude?.includes(toolInstance.name);
    });
  }

  if (config.disableMutations) {
    filteredTools = filteredTools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return toolInstance.type === ToolType.QUERY;
    });
  }

  return filteredTools;
}
