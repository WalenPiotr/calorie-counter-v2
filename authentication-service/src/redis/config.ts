import Redis from "ioredis";

const port = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT)
  : undefined;
const password = process.env.REDIS_PASSWORD;

let redis: Redis.Redis | undefined;
if (port && password) {
  redis = new Redis({
    port,
    password,
  });
} else {
  throw new Error("INVALID REDIS CONFIG");
}

export default redis;
