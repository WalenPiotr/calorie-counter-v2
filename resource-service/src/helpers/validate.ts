import { validate, ValidateNested } from "class-validator";
import {
  ArgumentValidationError,
  createMethodDecorator,
  Field,
} from "type-graphql";
import { plainToClass, Type } from "class-transformer";
import {
  ReturnTypeFunc,
  AdvancedOptions,
  MethodAndPropDecorator,
} from "type-graphql/dist/decorators/types";

export function ValidateInput<T>(field: string, clz: new (obj?: any) => T) {
  return createMethodDecorator(async ({ args }, next) => {
    const obj = plainToClass<T, any>(clz, args[field]);
    const errors = await validate(obj);
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
    return next();
  });
}

export function NestedField(
  returnTypeFunction: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodAndPropDecorator {
  const fieldFn = Field(returnTypeFunction, options);
  const typeFn = Type(returnTypeFunction as any);
  const validateNestedFn = ValidateNested();
  const func = (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<{}>,
  ): void => {
    fieldFn(target, propertyKey, descriptor);
    typeFn(target, propertyKey as string);
    validateNestedFn(target, propertyKey as string);
  };
  return func as MethodAndPropDecorator;
}
