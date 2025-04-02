import { z } from 'zod';
import { InputType } from '../core/tool';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { getBoardSchema } from '../monday-graphql/queries.graphql';
import { GetBoardSchemaQuery, GetBoardSchemaQueryVariables } from '../monday-graphql/generated/graphql';

export const getBoardSchemaToolSchema = {
  boardId: z.number(),
};

export class GetBoardSchemaTool extends BaseMondayApiTool<typeof getBoardSchemaToolSchema> {
  name = 'get_board_schema';
  description = 'Get board schema by board id';
  inputSchema = getBoardSchemaToolSchema;

  async execute(input: InputType<typeof getBoardSchemaToolSchema>): Promise<string> {
    const variables: GetBoardSchemaQueryVariables = {
      boardId: input.boardId.toString(),
    };

    const res = await this.mondayApi.request<GetBoardSchemaQuery>(getBoardSchema, variables);

    return `The current schema of the board ${input.boardId} is: 
    \n\nColumns:\n ${res.boards?.[0]?.columns?.map((column) => `Id - ${column?.id}\n Title - ${column?.title}\n Type - ${column?.type}`).join('\n')}
    \n\nGroups:\n ${res.boards?.[0]?.groups?.map((group) => `Id - ${group?.id}\n Title - ${group?.title}`).join('\n')}`;
  }
}
