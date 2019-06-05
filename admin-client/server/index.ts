import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import { createServer } from "http";
import { parse } from "url";
import next from "next";

const { PORT } = process.env;
if (!PORT) {
  throw Error("No PORT env var provided");
}
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    const { pathname, query } = parsedUrl;
    app.render(req, res, pathname ? pathname : "", query);
  }).listen(PORT);
  console.log(`Admin client started on http://localhost:${PORT}`);
});
