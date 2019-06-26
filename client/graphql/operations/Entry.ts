import { gql } from "apollo-boost";

export const addEntry = gql`
  mutation addEntry($unitId: ID!, $mealId: ID!, $quantity: Float!) {
    addEntry(
      data: {
        newEntry: { unitId: $unitId, mealId: $mealId, quantity: $quantity }
      }
    ) {
      id
      unit {
        id
        name
        energy
        product {
          id
          name
        }
      }
      quantity
    }
  }
`;
