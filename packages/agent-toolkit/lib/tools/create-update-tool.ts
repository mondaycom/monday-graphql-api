import { z, ZodTypeAny } from 'zod';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { createUpdate } from '../monday-graphql/queries.graphql';
import { CreateUpdateMutation, CreateUpdateMutationVariables } from '../monday-graphql/generated/graphql';

export const createUpdateToolSchema = {
  itemId: z.number().describe('The id of the item to which the update will be added'),
  body: z.string().describe("The update to be created, must be relevant to the user's request"),
};

export class CreateUpdateTool extends BaseMondayApiTool<typeof createUpdateToolSchema> {
  name = 'create_update';
  description =
    "creating a new update in a monday.com board, Make sure the update is relevant to the user's request, if not directly specified, choose a update that is relevant to the user's request.";
  inputSchema = createUpdateToolSchema;

  async execute(input: z.objectOutputType<typeof createUpdateToolSchema, ZodTypeAny>): Promise<string> {
    const variables: CreateUpdateMutationVariables = {
      itemId: input.itemId.toString(),
      body: input.body,
    };

    const res = await this.mondayApi.request<CreateUpdateMutation>(createUpdate, variables);

    return `Update ${res.create_update?.id} successfully created on item ${input.itemId}`;
  }
}
