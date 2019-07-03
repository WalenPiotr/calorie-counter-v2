import { gql } from "apollo-boost";

export const getMealsByDate = gql`
  query getMealsByDate($date: DateTime!) {
    getMealsByDate(data: { date: $date }) {
      items {
        id
        name
        date
        entries {
          count
          items {
            id
            quantity
            unit {
              id
              name
              energy
              product {
                id
                name
                units {
                  items {
                    id
                    name
                    energy
                  }
                }
              }
            }
          }
        }
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
export const updateMeal = gql`
  mutation updateMeal($data: UpdateMealInput!) {
    updateMeal(data: $data)
  }
`;

export const removeMeal = gql`
  mutation removeMeal($data: RemoveMealInput!) {
    removeMeal(data: $data)
  }
`;

export const getDaysWithMeals = gql`
  query getDaysWithMeals($pagination: PaginationInput) {
    getDaysWithMyMeals(pagination: $pagination) {
      count
      items {
        date
        mealCount
        total
      }
    }
  }
`;

export const getMyEnergyValue = gql`
  query getMyEnergyValue($date: DateTime!) {
    getMyEnergyValue(data: { date: $date })
  }
`;
