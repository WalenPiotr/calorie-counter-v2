import { redirect } from "./redirect";
import gql from "graphql-tag";
import { ApolloClient } from "apollo-boost";
import { Role } from "../../graphql/generated/apollo";

const checkMe = (apolloClient: ApolloClient<any>) =>
  apolloClient
    .query({
      query: gql`
        query Me {
          me {
            id
            email
            displayName
            role
          }
        }
      `,
      fetchPolicy: "no-cache",
    })
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      return null;
    });

export interface Me {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export const authorized = async (props: any, roles: Role[]): Promise<void> => {
  const data = await checkMe(props.apolloClient);
  if (data && data.me && roles.indexOf(data.me.role) >= 0) {
    return;
  }
  redirect(props, "/access-denied");
  return;
};
