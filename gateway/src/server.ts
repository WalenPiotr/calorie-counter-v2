import dotenv from "dotenv";
if (!process.env.production) {
  dotenv.config();
}

import { ApolloServer } from "apollo-server-express";
import "cross-fetch/polyfill";
import Express from "express";
import { mergeSchemas, IFieldResolver } from "graphql-tools";
import { executableAuthSchema } from "./schemas/auth";
import { executableResourceSchema } from "./schemas/resource";

const main = async () => {
  const resourceSchema = await executableResourceSchema();
  const authSchema = await executableAuthSchema();

  const linkTypeDefs = `
    extend type User {
      createdEntries: [Entry]
      updatedEntries: [Entry]
      createdMeals: [Meal]
      updatedMeals: [Meal]
      createdProducts: [Product]
      updatedProducts: [Product]
      createdReports: [Report]
      createdUnits: [Unit]
      updatedUnits: [Unit]
    }

    extend type Entry {
      createdBy: User
      updatedBy: User
    }
    extend type Meal {
      createdBy: User
      updatedBy: User
    }
    extend type Product {
      createdBy: User
      updatedBy: User
    }
    extend type Report {
      createdBy: User
    }
    extend type Unit {
      createdBy: User
      updatedBy: User
    }
  `;

  const getEntitiesResolveCreator = (
    fieldName: string,
  ): IFieldResolver<any, any, any> => (user, _, context, info) => {
    return info.mergeInfo.delegateToSchema({
      schema: resourceSchema,
      operation: "query",
      fieldName,
      args: {
        id: user.id,
      },
      context,
      info,
    });
  };

  const getUserResolveCreator = (
    fieldName: string = "getUserById",
  ): IFieldResolver<any, any, any> => (entity, _, context, info) => {
    return info.mergeInfo.delegateToSchema({
      schema: authSchema,
      operation: "query",
      fieldName,
      args: {
        id: entity.createdById,
      },
      context,
      info,
    });
  };

  const schema = await mergeSchemas({
    schemas: [resourceSchema, authSchema, linkTypeDefs],
    resolvers: {
      User: {
        createdEntries: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getEntriesByCreatedById"),
        },
        updatedEntries: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getEntriesByUpdatedById"),
        },
        createdProducts: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getProductsByCreatedById"),
        },
        updatedProducts: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getProductsByUpdatedById"),
        },
        createdMeals: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getMealsByCreatedById"),
        },
        updatedMeals: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getMealsByUpdatedById"),
        },
        createdReports: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getReportsByCreatedById"),
        },
        createdUnits: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getUnitsByCreatedById"),
        },
        updatedUnits: {
          fragment: `... on User { id }`,
          resolve: getEntitiesResolveCreator("getUnitsByUpdatedById"),
        },
      },

      Entry: {
        createdBy: {
          fragment: `... on Entry { createdById }`,
          resolve: getUserResolveCreator(),
        },
        updatedBy: {
          fragment: `... on Entry { updatedById }`,
          resolve: getUserResolveCreator(),
        },
      },
      Meal: {
        createdBy: {
          fragment: `... on Meal { createdById }`,
          resolve: getUserResolveCreator(),
        },
        updatedBy: {
          fragment: `... on Meal { updatedById }`,
          resolve: getUserResolveCreator(),
        },
      },
      Product: {
        createdBy: {
          fragment: `... on Product { createdById }`,
          resolve: getUserResolveCreator(),
        },
        updatedBy: {
          fragment: `... on Product { updatedById }`,
          resolve: getUserResolveCreator(),
        },
      },
      Report: {
        createdBy: {
          fragment: `... on Report { createdById }`,
          resolve: getUserResolveCreator(),
        },
      },
      Unit: {
        createdBy: {
          fragment: `... on Unit { createdById }`,
          resolve: getUserResolveCreator(),
        },
        updatedBy: {
          fragment: `... on Unit { updatedById }`,
          resolve: getUserResolveCreator(),
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
