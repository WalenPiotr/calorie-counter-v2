import { gql } from "apollo-boost";

export const searchUser = gql`
  query searchUser($email: String!) {
    searchUser(email: $email) {
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
`;
