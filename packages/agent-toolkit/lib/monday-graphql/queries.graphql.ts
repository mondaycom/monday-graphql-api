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
