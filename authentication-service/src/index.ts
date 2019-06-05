import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import bodyParser from "body-parser";
import Express from "express";
import passport from "passport";
import "reflect-metadata";
import { createConnection } from "typeorm";
import googleRouter from "./routes/google";
import meRouter from "./routes/me";
import rootRouter from "./routes/root";
import usersRouter from "./routes/users";
import { googleStrategy } from "./strategy/google";
import session from "express-session";
import { sessionConfig } from "./session";

const main = async () => {
  const { PORT } = process.env;
  if (!PORT) {
    throw Error("No host env var");
  }

  const app = Express();

  await createConnection();

  app.use(bodyParser.json());
  app.use(session(sessionConfig));

  passport.use(googleStrategy);
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  app.use(passport.initialize());

  app.use("/google", googleRouter);
  app.use("/users", usersRouter);
  app.use("/me", meRouter);
  app.use("/", rootRouter);

  app.listen(PORT, () => {
    console.log(`Auth service started on http://localhost:${PORT}`);
  });
};

main().catch(err => console.error(err));
