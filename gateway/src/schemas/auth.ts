import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { createHttpLink } from "apollo-link-http";
import { ApolloError } from "apollo-server-core";
import "cross-fetch/polyfill";
import { introspectSchema, makeRemoteExecutableSchema } from "graphql-tools";
import { setContext } from "apollo-link-context";

const errorLink = onError(({ graphQLErrors, response }) => {
  if (graphQLErrors) {
    response!.errors = graphQLErrors.map(
      err => new ApolloError(err.message, err.extensions!.code),
    );
  }
});

const contextLink = setContext((_, context) => {
  const headers = context.graphqlContext.req.headers;
  return {
    headers,
  };
});

const httpLink = createHttpLink({
  fetch,
  uri: "http://localhost:8080/auth/graphql",
  credentials: "include",
});

export const executableAuthSchema = async () => {
  const typeDefs = await introspectSchema(httpLink);
  const schema = await makeRemoteExecutableSchema({
    schema: typeDefs,
    link: ApolloLink.from([errorLink, contextLink, httpLink]),
  });
  return schema;
};
