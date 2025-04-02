import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { GraphQLHandler } from '../utils/graphql-handler.js';
import { buildClientSchema, GraphQLSchema, parse, validate } from 'graphql';

// Schema management
let cachedSchema: GraphQLSchema | null = null;

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

// Define schemas for different operation types
const operationTypeSchema = z.enum(['query', 'mutation']).describe('The type of GraphQL operation');

const fieldSchema = z.object({
  name: z.string().describe('The name of the field to query'),
  subfields: z.array(z.string()).optional().describe('Subfields to include in the response'),
  arguments: z.record(z.any()).optional().describe('Arguments for the field'),
});

// Schema for building a GraphQL operation
const buildOperationSchema = z.object({
  operationType: operationTypeSchema,
  operationName: z.string().describe('The name of the operation (e.g., "getBoard", "createItem")'),
  fields: z.array(fieldSchema).describe('Fields to include in the operation'),
});

type BuildOperationInput = z.infer<typeof buildOperationSchema>;

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

// Helper function to validate GraphQL operation against schema
async function validateOperation(queryString: string): Promise<string[]> {
  const schema = await loadSchema();
  const documentAST = parse(queryString);
  const errors = validate(schema, documentAST);
  return errors.map((error) => error.message);
}

// Helper function to build GraphQL query string
function buildGraphQLOperation(input: BuildOperationInput): { query: string; variables: Record<string, any> } {
  const variables: Record<string, any> = {};

  // Build arguments string and collect variables
  const buildArgs = (args: Record<string, any> = {}, prefix: string = ''): string => {
    const argStrings = Object.entries(args).map(([key, value]) => {
      const varName = `${prefix}${key}`;
      variables[varName] = value;
      return `${key}: $${varName}`;
    });
    return argStrings.length ? `(${argStrings.join(', ')})` : '';
  };

  // Build field string
  const buildFields = (fields: typeof input.fields): string => {
    return fields
      .map((field) => {
        const args = buildArgs(field.arguments, `${field.name}_`);
        const subfields = field.subfields?.length ? ` { ${field.subfields.join(' ')} }` : '';
        return `${field.name}${args}${subfields}`;
      })
      .join('\n    ');
  };

  // Build variable definitions
  const varDefs = Object.entries(variables)
    .map(([key, value]) => {
      // Infer GraphQL type from value
      let type =
        typeof value === 'string'
          ? 'String'
          : typeof value === 'number'
            ? 'Int'
            : typeof value === 'boolean'
              ? 'Boolean'
              : 'String'; // Default to String for complex types
      return `$${key}: ${type}!`;
    })
    .join(', ');

  // Construct the full query
  const query = `
    ${input.operationType} ${input.operationName}${varDefs ? `(${varDefs})` : ''} {
      ${buildFields(input.fields)}
    }
  `;

  return { query, variables };
}

export const registerMondayGraphQLTools = (mcp: McpServer) => {
  // Tool to build and execute a GraphQL operation
  mcp.tool(
    'build and execute graphql',
    'Build and execute a GraphQL operation using the Monday.com schema',
    { inputSchema: buildOperationSchema },
    async ({ inputSchema }: { inputSchema: BuildOperationInput }) => {
      const graphqlHandler = GraphQLHandler.getInstance();

      try {
        // Build the operation
        const { query, variables } = buildGraphQLOperation(inputSchema);

        // Validate against schema
        const validationErrors = await validateOperation(query);
        if (validationErrors.length > 0) {
          return {
            content: validationErrors.map((error) => ({ type: 'text' as const, text: error })),
            _meta: {},
          };
        }

        // Execute the operation
        const { content, _meta } = await graphqlHandler.execute<GraphQLResponse>(query, variables, (data) => {
          if (!data) return 'No data returned from the query';
          return JSON.stringify(data, null, 2);
        });

        return {
          content: [
            { type: 'text' as const, text: 'Generated Query:' },
            { type: 'text' as const, text: query },
            { type: 'text' as const, text: '\nVariables:' },
            { type: 'text' as const, text: JSON.stringify(variables, null, 2) },
            { type: 'text' as const, text: '\nResponse:' },
            ...content,
          ],
          _meta,
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `GraphQL operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          _meta: {},
        };
      }
    },
  );
};

// Common queries and their field mappings for natural language queries
const commonQueryMappings = {
  boards: {
    operationType: 'query',
    operationName: 'getBoards',
    fields: [
      {
        name: 'boards',
        subfields: ['id', 'name', 'description', 'state', 'board_kind', 'created_at', 'updated_at'],
      },
    ],
  },
  board: {
    operationType: 'query',
    operationName: 'getBoard',
    fields: [
      {
        name: 'boards',
        arguments: { ids: [] },
        subfields: ['id', 'name', 'description', 'state', 'board_kind', 'items { id name }', 'groups { id title }'],
      },
    ],
  },
  items: {
    operationType: 'query',
    operationName: 'getItems',
    fields: [
      {
        name: 'items',
        arguments: { ids: [] },
        subfields: ['id', 'name', 'board { id name }', 'group { id title }', 'column_values { id title text }'],
      },
    ],
  },
  users: {
    operationType: 'query',
    operationName: 'getUsers',
    fields: [
      {
        name: 'users',
        subfields: ['id', 'name', 'email', 'title', 'created_at'],
      },
    ],
  },
  workspaces: {
    operationType: 'query',
    operationName: 'getWorkspaces',
    fields: [
      {
        name: 'workspaces',
        subfields: ['id', 'name', 'description', 'kind'],
      },
    ],
  },
};

export const registerMondayNaturalLanguageApiTool = (mcp: McpServer) => {
  mcp.tool(
    'monday data',
    'Get data from Monday.com using natural language',
    {
      inputSchema: z.object({
        query: z
          .string()
          .describe(
            'Natural language request for data from Monday.com, e.g. "Get all my boards" or "Get items from board 123456"',
          ),
      }),
    },
    async ({ inputSchema }) => {
      const graphqlHandler = GraphQLHandler.getInstance();
      const query = inputSchema.query.toLowerCase();

      try {
        // Load the schema for introspection
        const schema = await loadSchema();

        // Extract potential entity names and IDs from the query
        const entityMatches: Record<string, boolean> = {
          board: query.includes('board'),
          boards: query.includes('boards'),
          item: query.includes('item'),
          items: query.includes('items'),
          user: query.includes('user'),
          users: query.includes('users'),
          workspace: query.includes('workspace'),
          workspaces: query.includes('workspaces'),
          column: query.includes('column'),
          columns: query.includes('columns'),
          group: query.includes('group'),
          groups: query.includes('groups'),
          tag: query.includes('tag'),
          tags: query.includes('tags'),
          // Add other entities as needed
        };

        // Find all IDs mentioned in the query
        const idMatches = Array.from(
          query.matchAll(/\b(?:id|board|item|user|workspace|group|column)?\s*(?::|id|=|\s)\s*(\d+)\b/gi),
        );
        const ids = idMatches.map((match) => match[1]).filter(Boolean);

        // Determine the most likely root field from the schema
        const rootQueryType = schema.getQueryType();
        if (!rootQueryType) {
          throw new Error("GraphQL schema doesn't have a query type");
        }

        // Get all available root fields
        const rootFields = rootQueryType.getFields();

        // Try to find the most appropriate query based on the entity mentioned
        let selectedRootField = null;
        let queryArgs: Record<string, any> = {};
        let entitiesRequested: string[] = [];

        // Map natural language entity names to potential GraphQL root fields
        const entityFieldMap: Record<string, string[]> = Object.entries(entityMatches)
          .filter(([entity, isPresent]) => isPresent)
          .reduce((map: Record<string, string[]>, [entity]) => {
            // For plurals, try both the plural and singular form
            const singularForm = entity.endsWith('s') ? entity.slice(0, -1) : entity;

            // Look for exact matches first
            Object.keys(rootFields).forEach((fieldName) => {
              const lowerFieldName = fieldName.toLowerCase();
              if (lowerFieldName === entity || lowerFieldName === singularForm) {
                map[entity] = [...(map[entity] || []), fieldName];
              } else if (lowerFieldName.includes(entity) || lowerFieldName.includes(singularForm)) {
                // Add partial matches with lower priority
                map[entity] = [...(map[entity] || []), fieldName];
              }
            });

            return map;
          }, {});

        // Determine the most specific entity (singular entities with IDs take precedence)
        const prioritizedEntities = Object.keys(entityFieldMap).sort((a, b) => {
          // Singular entities have higher priority
          const aSingular = !a.endsWith('s');
          const bSingular = !b.endsWith('s');

          if (aSingular !== bSingular) return aSingular ? -1 : 1;

          // Shorter entity names are more specific (usually)
          return a.length - b.length;
        });

        // Find the best matching root field
        let rootFieldName = null;
        if (prioritizedEntities.length > 0) {
          const mainEntity = prioritizedEntities[0];
          entitiesRequested.push(mainEntity);

          if (entityFieldMap[mainEntity] && entityFieldMap[mainEntity].length > 0) {
            rootFieldName = entityFieldMap[mainEntity][0];
            selectedRootField = rootFields[rootFieldName];
          }
        }

        // If no root field was found by entity name, try to find a root field that matches
        // one of the common queries (boards, items, users)
        if (!selectedRootField) {
          const commonRootFields = ['boards', 'items', 'users', 'workspaces'];
          for (const field of commonRootFields) {
            if (rootFields[field]) {
              rootFieldName = field;
              selectedRootField = rootFields[field];
              entitiesRequested.push(field);
              break;
            }
          }
        }

        // If still no root field was found, default to 'me' if available (common entry point)
        if (!selectedRootField && rootFields['me']) {
          rootFieldName = 'me';
          selectedRootField = rootFields['me'];
          entitiesRequested.push('me');
        }

        // If we still don't have a selected field, pick the first available field
        if (!selectedRootField) {
          rootFieldName = Object.keys(rootFields)[0];
          selectedRootField = rootFields[rootFieldName];
          entitiesRequested.push(rootFieldName);
        }

        // Determine if we need to add ID arguments to the query
        const argTypes = selectedRootField.args?.reduce((acc: Record<string, any>, arg: any) => {
          acc[arg.name] = arg.type;
          return acc;
        }, {});

        // Look for potential ID argument fields
        const idArgNames = ['id', 'ids', 'board_id', 'item_id', 'user_id', 'workspace_id'];
        let idArgName = null;

        if (argTypes) {
          for (const argName of idArgNames) {
            if (argName in argTypes) {
              idArgName = argName;
              break;
            }
          }

          // If we found an ID argument and have IDs from the query, add them
          if (idArgName && ids.length > 0) {
            // Determine if the argument should be an array or single value
            const isListType = idArgName.endsWith('s');
            queryArgs[idArgName] = isListType ? ids : ids[0];
          }
        }

        // Build a query to fetch the requested data
        // Start with a reasonable set of fields to request
        const fields = getCommonFieldsForType(rootFieldName || '');

        // Build the operation
        const operationInput = {
          operationType: 'query' as const,
          operationName: `get${rootFieldName ? rootFieldName.charAt(0).toUpperCase() + rootFieldName.slice(1) : 'Data'}`,
          fields: [
            {
              name: rootFieldName || 'me',
              arguments: queryArgs,
              subfields: fields,
            },
          ],
        };

        // Build and validate the operation
        const { query: graphqlQuery, variables: graphqlVariables } = buildGraphQLOperation(operationInput);
        const validationErrors = await validateOperation(graphqlQuery);

        if (validationErrors.length > 0) {
          return {
            content: [
              { type: 'text' as const, text: 'Could not build a valid query based on your request:' },
              ...validationErrors.map((error) => ({ type: 'text' as const, text: error })),
            ],
            _meta: {},
          };
        }

        // Execute the operation
        const { content, _meta } = await graphqlHandler.execute<GraphQLResponse>(
          graphqlQuery,
          graphqlVariables,
          (data) => {
            if (!data) return 'No data returned from the query';
            return JSON.stringify(data, null, 2);
          },
        );

        return {
          content: [
            { type: 'text' as const, text: `Here's the ${entitiesRequested.join(', ')} data from Monday.com:` },
            { type: 'text' as const, text: 'Generated Query:' },
            { type: 'text' as const, text: graphqlQuery },
            { type: 'text' as const, text: '\nVariables:' },
            { type: 'text' as const, text: JSON.stringify(graphqlVariables, null, 2) },
            { type: 'text' as const, text: '\nResponse:' },
            ...content,
          ],
          _meta,
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get Monday.com data: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          _meta: {},
        };
      }
    },
  );
};

// Helper function to get common fields for different entity types
function getCommonFieldsForType(typeName: string): string[] {
  const commonFields: Record<string, string[]> = {
    // Default common fields for most types
    default: ['id', 'name', 'created_at', 'updated_at'],

    // Entity-specific field sets
    boards: ['id', 'name', 'description', 'state', 'board_kind', 'created_at', 'updated_at'],
    board: ['id', 'name', 'description', 'state', 'board_kind', 'items { id name }', 'groups { id title }'],
    items: ['id', 'name', 'board { id name }', 'group { id title }', 'column_values { id title text }'],
    item: ['id', 'name', 'board_id', 'created_at', 'updated_at'],
    users: ['id', 'name', 'email', 'title', 'created_at'],
    me: ['id', 'name', 'email', 'title', 'created_at'],
    workspaces: ['id', 'name', 'description', 'kind'],
    columns: ['id', 'title', 'type', 'settings_str'],
    groups: ['id', 'title', 'position'],
    tags: ['id', 'name', 'color'],
  };

  // Return entity-specific fields if available, otherwise return default fields
  return commonFields[typeName] || commonFields.default;
}

// Helper function to convert GraphQL type to string representation
function getGraphQLTypeString(type: any): string {
  if (!type) return 'String';

  if (type.kind === 'NON_NULL') {
    return `${getGraphQLTypeString(type.ofType)}!`;
  }

  if (type.kind === 'LIST') {
    return `[${getGraphQLTypeString(type.ofType)}]`;
  }

  // For SCALAR, ENUM, INPUT_OBJECT, etc.
  return type.name || 'String';
}

export const registerMondayExecuteGraphQLTools = (mcp: McpServer) => {
  // Keep the original execute graphql tool for direct queries
  mcp.tool(
    'execute graphql',
    'Execute a raw GraphQL query or mutation against the Monday.com API',
    {
      inputSchema: z.object({
        query: z.string().describe('The GraphQL query or mutation to execute'),
        variables: z.record(z.any()).optional().describe('Variables for the GraphQL operation'),
      }),
    },
    async ({ inputSchema }) => {
      const graphqlHandler = GraphQLHandler.getInstance();

      try {
        // Validate against schema first
        const validationErrors = await validateOperation(inputSchema.query);
        if (validationErrors.length > 0) {
          return {
            content: validationErrors.map((error) => ({ type: 'text' as const, text: error })),
            _meta: {},
          };
        }

        const { content, _meta } = await graphqlHandler.execute<GraphQLResponse>(
          inputSchema.query,
          inputSchema.variables || {},
          (data) => {
            if (!data) return 'No data returned from the query';
            return JSON.stringify(data, null, 2);
          },
        );

        return { content, _meta };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `GraphQL operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          _meta: {},
        };
      }
    },
  );
};
