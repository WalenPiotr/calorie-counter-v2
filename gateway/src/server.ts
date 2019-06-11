import dotenv from "dotenv";
if (!process.env.production) {
  dotenv.config();
}

import { ApolloServer } from "apollo-server-express";
import "cross-fetch/polyfill";
import Express from "express";
import { mergeSchemas } from "graphql-tools";
import { executableAuthSchema } from "./schemas/auth";
import { linkTypeDefs } from "./schemas/link-schema";
import { executableResourceSchema } from "./schemas/resource";

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
  const formatError = (error: any) => {
    return error;
  };
  const app = Express();
  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: "http://localhost:3000",
  //   }),
  // );
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => {
      return {
        req,
        res,
      };
    },
    formatError,
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(process.env.PORT ? process.env.PORT : 3000, () => {
    console.log("Gateway started!");
  });
};

main().catch(err => console.error(err));
