import { z } from 'zod';
import { BaseMondayApiTool } from '../core/base-monday-api-tool';
import { createBoard } from '../monday-graphql/queries.graphql';
import { BoardKind, CreateBoardMutation, CreateBoardMutationVariables } from '../monday-graphql/generated/graphql';
import { ToolInputType, ToolOutputType, ToolType } from '../core/tool';

export const createBoardToolSchema = {
  boardName: z.string().describe('The name of the board to create'),
  boardKind: z.nativeEnum(BoardKind).default(BoardKind.Public).describe('The kind of board to create'),
  boardDescription: z.string().optional().describe('The description of the board to create'),
  workspaceId: z.string().optional().describe('The ID of the workspace to create the board in'),
};

export class CreateBoardTool extends BaseMondayApiTool<typeof createBoardToolSchema, never> {
  name = 'create_board';
  type = ToolType.MUTATION;

  getDescription(): string {
    return 'Create a monday.com board';
  }

  getInputSchema(): typeof createBoardToolSchema {
    return createBoardToolSchema;
  }

  async execute(input: ToolInputType<typeof createBoardToolSchema>): Promise<ToolOutputType<never>> {
    const variables: CreateBoardMutationVariables = {
      boardName: input.boardName,
      boardKind: input.boardKind,
      boardDescription: input.boardDescription,
      workspaceId: input.workspaceId,
    };

    const res = await this.mondayApi.request<CreateBoardMutation>(createBoard, variables);

    return {
      content: `Board ${res.create_board?.id} successfully created`,
    };
  }
}
