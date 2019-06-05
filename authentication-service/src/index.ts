import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import connectRedis from "connect-redis";
import Express from "express";
import session from "express-session";
import passport from "passport";
import {
  OAuth2Strategy as GoogleStrategy,
  Profile,
} from "passport-google-oauth";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Provider, Role, Status, User } from "./entity/User";
import redis from "./redis/config";
import bodyParser from "body-parser";

const main = async () => {
  const app = Express();
  app.use(bodyParser.json());
  const RedisStore = connectRedis(session);
  await createConnection();
  if (process.env.REDIS_SECRET) {
    app.use(
      session({
        store: new RedisStore({
          client: redis as any,
        }),
        name: "qid",
        secret: process.env.REDIS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60,
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
        },
        async function(_, __, profile: Profile, done) {
          if (profile && profile.emails) {
            const count = await User.count();

            const found = await User.findOne({
              externalId: profile.id,
              provider: Provider.GOOGLE,
            });
            if (found) {
              return done(null, found);
            }
            const created = await User.create({
              email: profile.emails[0].value,
              displayName: profile.displayName,
              externalId: profile.id,
              provider: Provider.GOOGLE,
              role: count === 0 ? Role.ADMIN : Role.USER,
              status: Status.OK,
            }).save();
            return done(null, created);
          }
          return done(new Error("No profile provided"));
        },
      ),
    );
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
    app.use(passport.initialize());
    app.get(
      "/login",
      passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
        prompt: "select_account",
        session: true,
      }),
    );
    app.get(
      "/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/login",
        session: true,
      }),
      async function(_, res) {
        res.redirect("/api/graphql");
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
  app.get("/isalive", (_, res) => {
    res.send("Auth service is alive");
  });

  const isAuthenticated = (roles?: Role[]) => (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) => {
    if (req.session) {
      const { user } = req.session.passport;
      if (!roles && user) {
        return next();
      }
      if (roles && user && roles.indexOf(user.role) >= 0) {
        return next();
      }
    }
    return res.redirect("/login");
  };

  const removeUndefinded = (obj: any) =>
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .reduce((newObj, [k, v]) => Object.assign(newObj, { [k]: v }), {});

  app.get("/users", isAuthenticated([Role.ADMIN]), async (req, res) => {
    const email = req.query.email;
    const displayName = req.query.name;
    const role = req.query.role;
    const provider = req.query.provider;
    const status = req.query.status;
    const queryObj = {
      email,
      displayName,
      role,
      provider,
      status,
    };
    const users = await User.find(removeUndefinded(queryObj));
    res.json(users);
  });

  app.get("/users/:id", isAuthenticated([Role.ADMIN]), async (req, res) => {
    const { id } = req.params;
    const users = await User.findOne({ id });
    res.json(users);
  });

  app.patch("/users/:id/", isAuthenticated([Role.ADMIN]), async (req, res) => {
    const { id } = req.params;
    const { status, displayName, role } = req.body;
    if (status === Status.OK || status === Status.BANNED) {
      await User.update({ id }, { status, displayName, role });
    }
    res.json(true);
  });

  app.get("/me", isAuthenticated(), async (req, res) => {
    const { user } = req.session!.passport;
    return res.json(user);
  });

  app.patch("/me", isAuthenticated(), async (req, res) => {
    const { displayName } = req.body;
    const { id } = req.session!.passport.user;
    await User.update({ id }, { displayName });
    res.json(true);
  });

  const { PORT } = process.env;
  if (!PORT) {
    throw Error("No host env var");
  }

  app.listen(PORT, () => {
    console.log(`Auth service started on http://localhost:${PORT}`);
  });
};

main().catch(err => console.error(err));
