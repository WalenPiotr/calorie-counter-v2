import { gql } from "apollo-boost";

export const reportProduct = gql`
  mutation reportProduct($id: ID!, $message: String!, $reason: ReportReason!) {
    reportProduct(data: { productId: $id, message: $message, reason: $reason })
  }
`;
