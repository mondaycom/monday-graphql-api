import { z, ZodTypeAny } from 'zod';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { createItem } from '../monday-graphql/queries.graphql';
import { CreateItemMutation, CreateItemMutationVariables } from '../monday-graphql/generated/graphql';
import { ToolType } from 'lib/core';

export const createItemToolSchema = {
  boardId: z.number(),
  name: z.string().describe("The name of the new item to be created, must be relevant to the user's request"),
  groupId: z
    .string()
    .optional()
    .describe('The id of the group id to which the new item will be added, if its not clearly specified, leave empty'),
  columnValues: z
    .string()
    .describe(
      `A string containing the new column values for the item following this structure: {\\"column_id\\": \\"value\\",... you can change multiple columns at once, note that for status column you must use nested value with 'label' as a key and for date column use 'date' as key} - example: "{\\"text_column_id\\":\\"New text\\", \\"status_column_id\\":{\\"label\\":\\"Done\\"}, \\"date_column_id\\":{\\"date\\":\\"2023-05-25\\"}, \\"phone_id\\":\\"123-456-7890\\", \\"email_id\\":\\"test@example.com\\"}"`,
    ),
};

export class CreateItemTool extends BaseMondayApiTool<typeof createItemToolSchema> {
  name = 'create_item';
  description =
    "creating a new item in a monday.com board, Make sure the item name is relevant to the user's request, if not directly specified, choose a name that is relevant to the user's request.";
  inputSchema = createItemToolSchema;
  type = ToolType.MUTATION;

  async execute(input: z.objectOutputType<typeof createItemToolSchema, ZodTypeAny>): Promise<string> {
    const variables: CreateItemMutationVariables = {
      boardId: input.boardId.toString(),
      itemName: input.name,
      groupId: input.groupId,
      columnValues: input.columnValues,
    };

    const res = await this.mondayApi.request<CreateItemMutation>(createItem, variables);

    return `Item ${res.create_item?.id} successfully created`;
  }
}
