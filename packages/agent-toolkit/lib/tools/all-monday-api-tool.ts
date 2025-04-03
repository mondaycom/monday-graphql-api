import { z } from 'zod';
import { BaseMondayApiTool, MondayApiToolContext } from '../core/base-monday-api-tool';
import { ToolInputType, ToolOutputType, ToolType } from '../core/tool';
import { buildClientSchema, GraphQLSchema, parse, validate } from 'graphql';
import { ApiClient } from '@mondaydotcomorg/api';

let cachedSchema: GraphQLSchema | null = null;

let mondayApiClient: ApiClient | null = null;

async function loadSchema(): Promise<GraphQLSchema> {
  if (cachedSchema) return cachedSchema;

  try {
    const response = await fetch('https://api.monday.com/v2/get_schema');
    const { data } = await response.json();
    cachedSchema = buildClientSchema(data);
    return cachedSchema;
  } catch (error) {
    throw new Error(`Failed to load GraphQL schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function validateOperation(queryString: string): Promise<string[]> {
  const schema = await loadSchema();
  const documentAST = parse(queryString);
  const errors = validate(schema, documentAST);
  return errors.map((error) => error.message);
}

export const allMondayApiToolSchema = {
  query: z.string().describe('Custom GraphQL query/mutation. you need to provide the full query / mutation'),
  variables: z.string().describe('JSON string containing the variables for the GraphQL operation'),
};

interface GraphQLResponse {
  data?: unknown;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export class AllMondayApiTool extends BaseMondayApiTool<typeof allMondayApiToolSchema> {
  name = 'all_monday_api';
  type = ToolType.ALL_API;

  constructor(mondayApi: ApiClient, context?: MondayApiToolContext) {
    super(mondayApi, context);
    mondayApiClient = this.mondayApi;
  }

  getDescription(): string {
    return 'Execute any Monday.com API operation by generating GraphQL queries and mutations dynamically';
  }

  getInputSchema(): typeof allMondayApiToolSchema {
    return allMondayApiToolSchema;
  }

  async execute(input: ToolInputType<typeof allMondayApiToolSchema>): Promise<ToolOutputType<never>> {
    const { query, variables } = input;

    try {
      let parsedVariables = {};
      try {
        parsedVariables = JSON.parse(variables);
      } catch (error) {
        return {
          content: `Error parsing variables: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }

      const validationErrors = await validateOperation(query);
      if (validationErrors.length > 0) {
        return {
          content: validationErrors.join(', '),
        };
      }

      const data = await this.mondayApi.request<GraphQLResponse>(query, parsedVariables);
      return {
        content: JSON.stringify(data),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (error instanceof Error && 'response' in error) {
        const clientError = error as any;
        if (clientError.response?.errors) {
          return {
            content: clientError.response.errors.map((e: any) => e.message).join(', '),
          };
        }
      }

      return {
        content: errorMessage,
      };
    }
  }
}
