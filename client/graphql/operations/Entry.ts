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

export const removeEntry = gql`
  mutation removeEntry($id: ID!) {
    removeEntry(data: { id: $id })
  }
`;

export const updateEntry = gql`
  mutation updateEntry($id: ID!, $newEntry: EntryInput!) {
    updateEntry(
      data: {
        id: $id,
        newEntry: $newEntry
      }
    ) 
  }
`;
