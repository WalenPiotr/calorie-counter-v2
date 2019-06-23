import { gql } from "apollo-boost";

export const searchProducts = gql`
  query searchProducts($name: String!, $skip: Int, $take: Int) {
    searchProducts(
      data: { name: $name }
      pagination: { take: $take, skip: $skip }
    ) {
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
          count
        }
        units {
          count
        }
      }
    }
  }
`;

export const addProductWithUnits = gql`
  mutation addProductWithUnits(
    $newUnits: [UnitInput!]!
    $newProduct: ProductInput!
  ) {
    addProductWithUnits(
      data: { newUnits: $newUnits, newProduct: $newProduct }
    ) {
      id
    }
  }
`;

export const getProduct = gql`
  query getProduct($id: ID!) {
    getProduct(data: { id: $id }) {
      id
      name
      createdAt
      createdBy {
        id
        displayName
        email
      }
      reports {
        count
        items {
          id
          reason
          message
          status
          createdBy {
            id
            displayName
            email
          }
          createdAt
        }
      }
      units {
        count
        items {
          id
          name
          energy
        }
      }
    }
  }
`;

export const deleteProduct = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(data: { id: $id })
  }
`;

export const updateProductWithUnits = gql`
  mutation updateProductWithUnits(
    $id: ID!
    $newUnits: [UnitInput!]!
    $newProduct: ProductInput!
  ) {
    updateProductWithUnits(
      data: { id: $id, newProduct: $newProduct, newUnits: $newUnits }
    )
  }
`;
