import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import Express from "express";
import session from "express-session";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import redis from "./redis/config";
import { ProductResolver } from "./resolvers/Product";
import cookieParser from "cookie-parser";
import { authChecker } from "./auth/authChecker";
import passport from "passport";

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
  app.use(cookieParser());
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
  });
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => {
      return {
        req,
        res,
      };
    },
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(PORT, () => {
    console.log(`Resource service started on http://localhost:${PORT}/graphql`);
  });
};

main().catch(err => console.error(err));
