import { createHttpLink } from "apollo-link-http";
import { introspectSchema } from "graphql-tools";
import fs from "fs";
import path from "path";
import { printSchema } from "graphql/utilities";
import "cross-fetch/polyfill";

const destination = "graphql";
const httpConvectionLink = createHttpLink({
  fetch,
  uri: "http://localhost:8080/auth/graphql",
});

introspectSchema(httpConvectionLink).then(schema => {
  fs.writeFileSync(
    path.join(destination, "auth-api.graphql"),
    printSchema(schema, { commentDescriptions: true }),
  );
});
