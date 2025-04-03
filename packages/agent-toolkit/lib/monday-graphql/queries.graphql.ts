import { gql } from 'graphql-request';

export const deleteItem = gql`
  mutation DeleteItem($id: ID!) {
    delete_item(item_id: $id) {
      id
    }
  }
`;

export const getBoardItemsByName = gql`
  query GetBoardItemsByName($boardId: ID!, $term: CompareValue!) {
    boards(ids: [$boardId]) {
      items_page(query_params: { rules: [{ column_id: "name", operator: contains_text, compare_value: $term }] }) {
        items {
          id
          name
        }
      }
    }
  }
`;

export const createItem = gql`
  mutation createItem($boardId: ID!, $itemName: String!, $groupId: String, $columnValues: JSON) {
    create_item(board_id: $boardId, item_name: $itemName, group_id: $groupId, column_values: $columnValues) {
      id
      name
    }
  }
`;

export const createUpdate = gql`
  mutation createUpdate($itemId: ID!, $body: String!) {
    create_update(item_id: $itemId, body: $body) {
      id
    }
  }
`;

export const getBoardSchema = gql`
  query getBoardSchema($boardId: ID!) {
    boards(ids: [$boardId]) {
      groups {
        id
        title
      }
      columns {
        id
        type
        title
      }
    }
  }
`;

export const getUsersByName = gql`
  query getUsersByName($name: String) {
    users(name: $name) {
      id
      name
      title
    }
  }
`;

export const changeItemColumnValues = gql`
  mutation changeItemColumnValues($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
    change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnValues) {
      id
    }
  }
`;

export const moveItemToGroup = gql`
  mutation moveItemToGroup($itemId: ID!, $groupId: String!) {
    move_item_to_group(item_id: $itemId, group_id: $groupId) {
      id
    }
  }
`;

export const createBoard = gql`
  mutation createBoard($boardKind: BoardKind!, $boardName: String!, $boardDescription: String, $workspaceId: ID) {
    create_board(
      board_kind: $boardKind
      board_name: $boardName
      description: $boardDescription
      workspace_id: $workspaceId
      empty: true
    ) {
      id
    }
  }
`;

export const createColumn = gql`
  mutation createColumn(
    $boardId: ID!
    $columnType: ColumnType!
    $columnTitle: String!
    $columnDescription: String
    $columnSettings: JSON
  ) {
    create_column(
      board_id: $boardId
      column_type: $columnType
      title: $columnTitle
      description: $columnDescription
      defaults: $columnSettings
    ) {
      id
    }
  }
`;

export const deleteColumn = gql`
  mutation deleteColumn($boardId: ID!, $columnId: String!) {
    delete_column(board_id: $boardId, column_id: $columnId) {
      id
    }
  }
`;

export const getGraphQLSchema = gql`
  query getGraphQLSchema {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      types {
        name
        kind
      }
    }
    queryType: __type(name: "Query") {
      name
      fields {
        name
        description
        type {
          name
          kind
          ofType {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
    mutationType: __type(name: "Mutation") {
      name
      fields {
        name
        description
        type {
          name
          kind
          ofType {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`;

export const introspectionQuery = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      subscriptionType {
        name
      }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args(includeDeprecated: true) {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args(includeDeprecated: true) {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields(includeDeprecated: true) {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type {
      ...TypeRef
    }
    defaultValue
    isDeprecated
    deprecationReason
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

// it cant be a variable due to a bug in the API so must be generated string.
export const generateTypeDetailsQuery = (typeName: string) => gql`
  query getTypeDetails {
    __type(name: "${typeName}") {
      name
      description
      kind
      fields {
        name
        description
        type {
          name
          kind
          ofType {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
        args {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
          defaultValue
        }
      }
      inputFields {
        name
        description
        type {
          name
          kind
          ofType {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
        defaultValue
      }
      interfaces {
        name
      }
      enumValues {
        name
        description
      }
      possibleTypes {
        name
      }
    }
  }
`;
