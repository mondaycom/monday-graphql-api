import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ApiClient } from '@mondaydotcomorg/api';
import { CreateItemMutation, CreateItemMutationVariables } from '../../src/generated/graphql.js';
import { createItem } from '../../src/queries.graphql.js';

// Define the input schema for the tool
const createItemSchema = z.object({
  boardId: z.string().describe('The ID of the board to create the item in'),
  itemName: z.string().describe('The name of the item to create'),
});

type CreateItemInput = z.infer<typeof createItemSchema>;

export const registerCreateItemTool = (mcp: McpServer) => {
  mcp.tool(
    'create monday item',
    'Create a new item in a Monday.com board',
    {
      inputSchema: createItemSchema,
    },
    async ({ inputSchema }: { inputSchema: CreateItemInput }) => {
      try {
        const token = process.env.MONDAY_API_TOKEN;

        if (!token) {
          throw new Error('MONDAY_API_TOKEN environment variable is not set');
        }

        const apiClient = new ApiClient({ token });

        const queryVariables: CreateItemMutationVariables = {
          boardId: inputSchema.boardId.toString(),
          itemName: inputSchema.itemName,
        };

        const response = await apiClient.request<CreateItemMutation>(createItem, queryVariables);

        return {
          content: [
            {
              type: 'text',
              text: `Successfully created item "${inputSchema.itemName}" with ID: ${response.create_item?.id}`,
            },
          ],
          _meta: {},
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating item: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          _meta: {},
        };
      }
    },
  );
};
