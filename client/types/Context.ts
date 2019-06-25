import { ApolloClient } from "apollo-boost";
import { NextContext } from "next";

export interface Context extends NextContext {
  apolloClient: ApolloClient<any>;
}
