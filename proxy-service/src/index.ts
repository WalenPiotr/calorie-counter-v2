import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import Express from "express";
import httpProxy from "express-http-proxy";

const main = async () => {
  const { AUTH_HOST, APP_HOST, PORT, API_HOST } = process.env;
  if (!AUTH_HOST) {
    throw Error("No AUTH_HOST env var provided");
  }
  if (!APP_HOST) {
    throw Error("No APP_HOST env var provided");
  }
  if (!PORT) {
    throw Error("No PORT env var provided");
  }
  if (!API_HOST) {
    throw Error("No API_HOST env var provided");
  }
  const app = Express();
  app.get("/isalive", (_, res) => res.send("Proxy service is alive"));
  app.use("/auth", httpProxy(AUTH_HOST));
  app.use("/api", httpProxy(API_HOST));
  // app.use("/", httpProxy(APP_HOST));
  app.listen(PORT, () => {
    console.log(`Proxy service started on http://localhost:${PORT}`);
  });
};

main().catch(err => console.error(err));
