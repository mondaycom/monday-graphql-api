import { gql } from 'graphql-request';

export const deleteItem = gql`
  mutation DeleteItem($id: ID!) {
    delete_item(item_id: $id) {
      id
    }
  }
`;
