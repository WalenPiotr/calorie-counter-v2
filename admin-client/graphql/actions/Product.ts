import { gql } from "apollo-boost";

export const searchProducts = gql`
  query searchProducts($name: String!) {
    searchProducts(data: { name: $name }) {
      count
      items {
        id
        name
        createdAt
        createdBy {
          id
          displayName
        }
        updatedAt
        updatedBy {
          id
          displayName
        }
        reports {
          id
        }
      }
    }
  }
`;
