import { ApolloError } from "apollo-server-express";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import "reflect-metadata";
import { ArgumentValidationError, UnauthorizedError } from "type-graphql";
import { QueryFailedError } from "typeorm";

export const formatError = (error: GraphQLError): GraphQLFormattedError => {
  if (error.originalError instanceof ApolloError) {
    return error;
  }
  if (error.originalError instanceof ArgumentValidationError) {
    const { extensions, locations, message, path } = error;
    error.extensions!.code = "VALIDATION_FAILED";
    return {
      extensions,
      locations,
      message,
      path,
    };
  }

  if (error.originalError instanceof UnauthorizedError) {
    const { extensions, locations, message, path } = error;
    error.extensions!.code = "AUTHENTICATION_FAILED";
    return {
      extensions,
      locations,
      message,
      path,
    };
  }
  if (error.originalError instanceof QueryFailedError) {
    const { extensions, locations, message, path } = error;
    error.extensions!.code = `DUPLICATE_KEY_VALUE`;
    const originalError = error.originalError as any;
    if ((originalError["code"] = "23505")) {
      return {
        extensions,
        locations,
        message,
        path,
      };
    }
  }
  error.message = "Internal Server Error";
  return error;
};
