import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateItemMutation, CreateItemMutationVariables } from '../../src/generated/graphql.js';
import { createItem } from '../../src/queries.graphql.js';
import { GraphQLHandler } from '../../utils/graphql-handler.js';

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
        const graphqlHandler = GraphQLHandler.getInstance();

        const queryVariables: CreateItemMutationVariables = {
          boardId: inputSchema.boardId.toString(),
          itemName: inputSchema.itemName,
        };

        const { content, _meta } = await graphqlHandler.execute<CreateItemMutation>(
          createItem,
          queryVariables,
          (data) => `Successfully created item "${inputSchema.itemName}" with ID: ${data.create_item?.id}`,
        );

        return { content, _meta };
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
