import { getFromContainer, MetadataStorage } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
export { PaginationInput } from "./types/Pagination";
export { AddProductWithUnitsInput } from "./resolvers/Product";
import fs from "fs";

const metadatas = (getFromContainer(MetadataStorage) as any)
  .validationMetadatas;
const schemas = validationMetadatasToSchemas(metadatas);

fs.writeFile("validation-schema.json", JSON.stringify(schemas), err => {
  if (err) {
    console.log(err);
  }
});
