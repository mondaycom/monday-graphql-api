import { z } from 'zod';
import { ToolInputType, ToolOutputType, ToolType } from '../core/tool';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { getUsersByName } from '../monday-graphql/queries.graphql';
import { GetUsersByNameQuery, GetUsersByNameQueryVariables } from '../monday-graphql/generated/graphql';

export const getUsersToolSchema = {
  name: z.string().optional().describe('The name or partial name of the user to get'),
};

export class GetUsersTool extends BaseMondayApiTool<typeof getUsersToolSchema> {
  name = 'get_users_by_name';
  type = ToolType.QUERY;

  getDescription(): string {
    return 'Get users, can be filtered by name or partial name';
  }

  getInputSchema(): typeof getUsersToolSchema {
    return getUsersToolSchema;
  }

  async execute(input: ToolInputType<typeof getUsersToolSchema>): Promise<ToolOutputType<never>> {
    const variables: GetUsersByNameQueryVariables = {
      name: input.name,
    };

    const res = await this.mondayApi.request<GetUsersByNameQuery>(getUsersByName, variables);
    return {
      content: `Relevant users:\n ${res.users?.map((user) => ` id: ${user?.id}, name: ${user?.name}, title: ${user?.title}`).join('\n')}`,
    };
  }
}
