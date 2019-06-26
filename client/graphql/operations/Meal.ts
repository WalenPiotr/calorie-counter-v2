import { gql } from "apollo-boost";

export const getMealsByDate = gql`
  query getMealsByDate($date: DateTime!) {
    getMealsByDate(data: { date: $date }) {
      items {
        id
        name
        date
      }
    }
  }
`;

export const addMeal = gql`
  mutation addMeal($name: String!, $date: DateTime!) {
    addMeal(data: { newMeal: { name: $name, date: $date } }) {
      id
      name
      date
    }
  }
`;
