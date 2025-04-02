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
