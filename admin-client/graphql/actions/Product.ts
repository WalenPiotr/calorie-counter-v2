import { gql } from "apollo-boost";

export const searchProducts = gql`
  query searchProducts($name: String!) {
    searchProducts(name: $name) {
      id
      name
      createdAt
      createdBy {
        id
        name
      }
      updatedAt
      updatedBy {
        id
        name
      }
      reports {
        id
      }
      
    }
  }
`;
