import { z } from 'zod';
import { InputType } from '../core/tool';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { getBoardItemsByName } from '../monday-graphql/queries.graphql';
import { GetBoardItemsByNameQuery, GetBoardItemsByNameQueryVariables } from '../monday-graphql/generated/graphql';

export const getItemsToolSchema = {
  boardId: z.number(),
  term: z.string(),
};

export class GetBoardItemsTool extends BaseMondayApiTool<typeof getItemsToolSchema> {
  name = 'get_board_items_by_name';
  description = 'Get items by board id and term';
  inputSchema = getItemsToolSchema;

  async execute(input: InputType<typeof getItemsToolSchema>): Promise<string> {
    const variables: GetBoardItemsByNameQueryVariables = {
      boardId: input.boardId.toString(),
      term: input.term,
    };

    const res = await this.mondayApi.request<GetBoardItemsByNameQuery>(getBoardItemsByName, variables);

    // TODO: add structured output
    // TODO: add pagination?
    return `Items ${res.boards?.[0]?.items_page?.items?.map((item) => `name: ${item.name}, id: ${item.id}`).join(', ')} successfully fetched`;
  }
}
