import { ApiClient } from '@mondaydotcomorg/api';
import { ToolType } from '../core/tool';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';

export type ToolsConfiguration = {
  include?: string[];
  exclude?: string[];
  readOnlyMode?: boolean;
  disableAllApi?: boolean;
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

  if (config.readOnlyMode) {
    filteredTools = filteredTools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return toolInstance.type === ToolType.QUERY;
    });
  } else if (config.disableAllApi) {
    filteredTools = filteredTools.filter((tool) => {
      const toolInstance = new tool(apiClient);
      return toolInstance.type !== ToolType.ALL_API;
    });
  }

  return filteredTools;
}
