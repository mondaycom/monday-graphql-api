import { z, ZodTypeAny } from 'zod';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { deleteItem } from '../monday-graphql/queries.graphql';
import { DeleteItemMutation, DeleteItemMutationVariables } from '../monday-graphql/generated/graphql';
import { ToolType } from '../core/tool';

export const deleteItemToolSchema = {
  itemId: z.number(),
};

export class DeleteItemTool extends BaseMondayApiTool<typeof deleteItemToolSchema> {
  name = 'delete_item';
  description = 'Delete an item';
  type = ToolType.MUTATION;
  inputSchema = deleteItemToolSchema;

  async execute(input: z.objectOutputType<typeof deleteItemToolSchema, ZodTypeAny>): Promise<string> {
    const variables: DeleteItemMutationVariables = {
      id: input.itemId.toString(),
    };

    const res = await this.mondayApi.request<DeleteItemMutation>(deleteItem, variables);

    return `Item ${res.delete_item?.id} successfully deleted`;
  }
}
