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

export interface AuthData {
  isLoggedIn: boolean;
  role: Role;
}

export const authorized = async (
  props: any,
  roles: Role[],
): Promise<AuthData> => {
  const data = await checkMe(props.apolloClient);
  if (data && data.me && roles.indexOf(data.me.role) >= 0) {
    return { isLoggedIn: true, role: data.me.role };
  }
  return {
    isLoggedIn: false,
    role: data && data.me && data.me.role ? data.me.role : Role.User,
  };
};
