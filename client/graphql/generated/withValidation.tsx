import { Min, Max, MinLength, IsUppercase } from "class-validator";
import { PaginationInput, ProductInput, UnitInput } from "./apollo";

export class ProductInputWithValidation implements ProductInput {
  @MinLength(3)
  name: string;
}

export class UnitInputWithValidation implements UnitInput {
  @MinLength(3)
  name: string;

  @Min(0)
  energy: number;
}
