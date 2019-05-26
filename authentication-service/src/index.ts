import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import connectRedis from "connect-redis";
import cors from "cors";
import Express from "express";
import session from "express-session";
import "reflect-metadata";
import redis from "./redis/config";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";

const main = async () => {
  const app = Express();
  const RedisStore = connectRedis(session);
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    }),
  );
  if (process.env.REDIS_SECRET) {
    app.use(
      session({
        store: new RedisStore({
          client: redis as any,
        }),
        name: "qid",
        secret: process.env.REDIS_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          // maxAge: 1000 * 60 * 60 * 24 * 30,
          maxAge: 10000,
        },
      }),
    );
  } else {
    throw new Error("No redis kv-store secret provided");
  }
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL,
  } = process.env;
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REDIRECT_URL) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: GOOGLE_REDIRECT_URL,
          passReqToCallback: true,
        },
        function(req, _, __, profile, done) {
          req.session!.profile = profile;
          return done(null, profile);
        },
      ),
    );
    app.use(passport.initialize());
    app.get(
      "/login",
      passport.authenticate("google", {
        scope: ["https://www.googleapis.com/auth/plus.login"],
        session: false,
      }),
    );
    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
      }),
      function(_, res) {
        res.redirect("/");
      },
    );
  } else {
    throw new Error("Invalid google plus authentication config");
  }
  app.get("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.send("successfully log out!");
      });
    }
  });
  app.get("/", (_, res) => {
    res.send("OK");
  });
  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main().catch(err => console.error(err));
