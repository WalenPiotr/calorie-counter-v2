import { createMethodDecorator } from "type-graphql";
import { ValidationError } from "class-validator";

export function AlreadyCreated<T>(
  f: (input: T) => Promise<Boolean>,
  field: string,
) {
  return createMethodDecorator(async ({ args }, next) => {
    if (f(args[field].input)) {
      throw new ValidationError();
    }
    return next();
  });
}
