import { ApiClient } from '@mondaydotcomorg/api';
import { ClientError } from 'graphql-request';

type McpTextContent = {
  type: 'text';
  text: string;
  [key: string]: unknown;
};

type McpImageContent = {
  type: 'image';
  data: string;
  mimeType: string;
  [key: string]: unknown;
};

type McpResourceContent = {
  type: 'resource';
  resource:
    | {
        text: string;
        uri: string;
        mimeType?: string;
        [key: string]: unknown;
      }
    | {
        uri: string;
        blob: string;
        mimeType?: string;
        [key: string]: unknown;
      };
  [key: string]: unknown;
};

type McpContent = Array<McpTextContent | McpImageContent | McpResourceContent>;

type GraphQLResponse<T> = {
  data: T;
  content: McpContent;
  _meta: Record<string, unknown>;
};

export class GraphQLHandler {
  private apiClient: ApiClient;

  constructor() {
    const token = process.env.MONDAY_API_TOKEN;
    if (!token) {
      throw new Error('MONDAY_API_TOKEN environment variable is not set');
    }
    this.apiClient = new ApiClient({ token });
  }

  async execute<T>(
    query: string,
    variables: Record<string, unknown>,
    createSuccessMessage: (data: T) => string,
  ): Promise<GraphQLResponse<T>> {
    try {
      const response = await this.apiClient.request<T>(query, variables);

      return {
        data: response,
        content: [
          {
            type: 'text',
            text: createSuccessMessage(response),
          },
        ],
        _meta: {},
      };
    } catch (error) {
      let errorMessage = 'Unknown error occurred';

      if (error instanceof ClientError) {
        const errors = error.response.errors;
        errorMessage = errors ? `GraphQL Errors: ${errors.map((e) => e.message).join(', ')}` : error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  static getInstance(): GraphQLHandler {
    return new GraphQLHandler();
  }
}
