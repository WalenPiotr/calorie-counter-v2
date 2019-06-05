import redis from "./redis/config";
import connectRedis from "connect-redis";
import session from "express-session";

if (!process.env.REDIS_SECRET) {
  throw new Error("No redis kv-store secret provided");
}

const RedisStore = connectRedis(session);

const sessionConfig = {
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
};

export default session(sessionConfig);
