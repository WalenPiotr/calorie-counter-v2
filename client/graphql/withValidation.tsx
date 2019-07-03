import {
  Min,
  Max,
  MinLength,
  IsUppercase,
  IsDate,
  IsString,
} from "class-validator";
import {
  PaginationInput,
  ProductInput,
  UnitInput,
  MealInput,
  EntryInput,
} from "./generated/apollo";

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

export class MealInputWithValidation implements MealInput {
  @MinLength(1)
  name: string;

  @IsDate()
  date: Date;
}

export class EntryInputWithValidation implements EntryInput {
  @Min(0)
  quantity: number;

  @IsString()
  unitId: string;

  @IsString()
  mealId: string;
}


