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
