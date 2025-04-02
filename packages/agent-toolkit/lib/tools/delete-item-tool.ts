import { z } from 'zod';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { deleteItem } from '../monday-graphql/queries.graphql';
import { DeleteItemMutation, DeleteItemMutationVariables } from '../monday-graphql/generated/graphql';
import { ToolInputType, ToolOutputType, ToolType } from '../core/tool';

export const deleteItemToolSchema = {
  itemId: z.number(),
};

export class DeleteItemTool extends BaseMondayApiTool<typeof deleteItemToolSchema, never> {
  name = 'delete_item';
  type = ToolType.MUTATION;

  getDescription(): string {
    return 'Delete an item';
  }

  getInputSchema(): typeof deleteItemToolSchema {
    return deleteItemToolSchema;
  }

  async execute(input: ToolInputType<typeof deleteItemToolSchema>): Promise<ToolOutputType<never>> {
    const variables: DeleteItemMutationVariables = {
      id: input.itemId.toString(),
    };

    const res = await this.mondayApi.request<DeleteItemMutation>(deleteItem, variables);

    return {
      content: `Item ${res.delete_item?.id} successfully deleted`,
    };
  }
}
