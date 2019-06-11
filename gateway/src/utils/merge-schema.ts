import "cross-fetch/polyfill";
import { mergeSchemas } from "graphql-tools";
import { executableResourceSchema } from "../schemas/resource";
import { executableAuthSchema } from "../schemas/auth";
import fs from "fs";
import path from "path";
import { printSchema } from "graphql";
import { linkTypeDefs } from "../schemas/link-schema";

const main = async () => {
  const resourceSchema = await executableResourceSchema();
  const authSchema = await executableAuthSchema();
  const schema = await mergeSchemas({
    schemas: [resourceSchema, authSchema, linkTypeDefs],
    resolvers: {
      User: {
        products: {
          fragment: `... on User { id }`,
          resolve(user, _, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: resourceSchema,
              operation: "query",
              fieldName: "getProductsByCreatedById",
              args: {
                createdById: user.id,
              },
              context,
              info,
            });
          },
        },
      },
      Product: {
        createdBy: {
          fragment: `... on Product { createdById }`,
          resolve(product, _, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: authSchema,
              operation: "query",
              fieldName: "getUserById",
              args: {
                id: product.createdById,
              },
              context,
              info,
            });
          },
        },
        updatedBy: {
          fragment: `... on Product { updatedById }`,
          resolve(product, _, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: authSchema,
              operation: "query",
              fieldName: "getUserById",
              args: {
                id: product.updatedById,
              },
              context,
              info,
            });
          },
        },
      },
    },
  });
  fs.writeFileSync(
    path.join("graphql", "merged-api.graphql"),
    printSchema(schema, { commentDescriptions: true }),
  );
};

main().catch(err => console.error(err));
