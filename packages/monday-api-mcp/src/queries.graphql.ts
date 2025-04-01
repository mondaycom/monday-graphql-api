import { gql } from 'graphql-request';

export const createItem = gql`
  mutation CreateItem($boardId: ID!, $itemName: String!) {
    create_item(board_id: $boardId, item_name: $itemName) {
      id
      name
    }
  }
`;
