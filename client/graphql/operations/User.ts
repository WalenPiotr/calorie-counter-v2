import { gql } from "apollo-boost";

export const searchUser = gql`
  query searchUser($email: String!) {
    searchUser(data: { email: $email }) {
      count
      items {
        id
        email
        displayName
        role
        provider
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const getUser = gql`
  query getUser(
    $id: ID!
    $productPagination: PaginationInput
    $reportPagination: PaginationInput
  ) {
    getUserById(data: { id: $id }) {
      id
      email
      displayName
      role
      provider
      status
      createdAt
      updatedAt
      createdProducts(pagination: $productPagination) {
        count
        items {
          id
          name
          createdAt
          units {
            count
          }
        }
      }
      createdReports(pagination: $reportPagination) {
        count
        items {
          id
          reason
          message
          status
          createdAt
          product {
            id
            name
          }
        }
      }
    }
  }
`;
