import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import cors from "cors";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { authChecker } from "./helpers/authChecker";
import passportHandler from "./passport";
import googleRouter from "./routes/google";
import rootRouter from "./routes/root";
import sessionHandler from "./session";
import { formatError } from "./helpers/formatError";
import { MeResolver } from "./resolvers/Me";
import { UserResolver } from "./resolvers/User";

const main = async () => {
  const { PORT } = process.env;
  if (!PORT) {
    throw Error("No host env var");
  }
  const app = Express();
  await createConnection();
  app.use(bodyParser.json());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    }),
  );
  app.use(sessionHandler);
  app.use(passportHandler);

  app.use("/google", googleRouter);
  app.use("/", rootRouter);

  const schema = await buildSchema({
    resolvers: [UserResolver, MeResolver],
    authChecker: authChecker,
    validate: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => {
      return {
        req,
        res,
      };
    },
    formatError: formatError,
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log(`Auth service started on http://localhost:${PORT}`);
  });
};

main().catch(err => console.error(err));
