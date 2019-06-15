import { Max, Min } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

export interface ListWithCount<T> {
  count: number;
  items: T[];
}

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @Min(0)
  skip: number = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}
