import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import { ApolloError, ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import Express from "express";
import session from "express-session";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import passport from "passport";
import "reflect-metadata";
import {
  ArgumentValidationError,
  buildSchema,
  UnauthorizedError,
} from "type-graphql";
import { createConnection, QueryFailedError } from "typeorm";
import { authChecker } from "./helpers/authChecker";
import redis from "./redis/config";
import { ProductResolver } from "./resolvers/Product";

const main = async () => {
  const { REDIS_SECRET, PORT } = process.env;
  if (!REDIS_SECRET) {
    throw new Error("No redis kv-store secret provided");
  }
  if (!PORT) {
    throw new Error("No port provided");
  }

  await createConnection();
  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    }),
  );
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: REDIS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
      },
    }),
  );
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  const schema = await buildSchema({
    resolvers: [ProductResolver],
    authChecker: authChecker,
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => {
      return {
        req,
        res,
      };
    },
    formatError: (error: GraphQLError): GraphQLFormattedError => {
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
    },
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(PORT, () => {
    console.log(`Resource service started on http://localhost:${PORT}/graphql`);
  });
};

main().catch(err => console.error(err));
