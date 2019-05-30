import {
  IsPositive,
  MinLength,
  ArrayNotEmpty,
  ValidatorConstraintInterface,
  ValidationOptions,
  ValidatorConstraint,
  registerDecorator,
  ValidationArguments,
} from "class-validator";
import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Product } from "../entity/Product";
import { Report } from "../entity/Report";
import { Unit } from "../entity/Unit";
import { Role } from "../helpers/authChecker";
import { NestedField, ValidateInput } from "../helpers/validate";
import { ContextType } from "../types/ContextType";

@ValidatorConstraint({ async: true })
class ProductAlreadyExistsConstraint implements ValidatorConstraintInterface {
  async validate({ name }: ProductInput, _?: ValidationArguments) {
    const count = await Product.count({ name });
    return count === 0;
  }
  defaultMessage(_: ValidationArguments): string {
    return "Product already exists";
  }
}

function ProductAlreadyExists(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProductAlreadyExistsConstraint,
    });
  };
}

@InputType()
export class UnitInput {
  @Field()
  name: string;

  @Field()
  @IsPositive()
  energy: number;
}

@InputType()
export class ProductInput {
  @Field()
  @MinLength(3)
  name: string;

  @NestedField(() => UnitInput)
  @ArrayNotEmpty()
  units: UnitInput[];
}

@InputType()
export class AddProductInput {
  @NestedField(() => ProductInput)
  @ProductAlreadyExists()
  newProduct: ProductInput;
}

@ArgsType()
class SearchProductsArgs {
  @Field()
  name: string;
}

@InputType()
class DeleteProductInput {
  @Field(() => ID)
  id: number;
}

@InputType()
class UpdateProductInput {
  @Field(() => ID)
  id: number;

  @Field(() => ProductInput)
  newProduct: ProductInput;
}

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async searchProducts(@Args() args: SearchProductsArgs): Promise<Product[]> {
    return Product.createQueryBuilder()
      .where("LOWER(name) LIKE LOWER(:name)", { name: `%${args.name}%` })
      .getMany();
  }

  @Authorized()
  @ValidateInput("data", AddProductInput)
  @Mutation(() => Boolean)
  async addProduct(
    @Arg("data") data: AddProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { units, ...rest } = data.newProduct;
    const userId = ctx.req.session!.passport.user.id;
    const dbProduct = await Product.create({
      ...rest,
      createdById: userId,
      updatedById: userId,
    }).save();
    for (const unit of units) {
      await Unit.create({
        ...unit,
        createdById: userId,
        updatedById: userId,
        product: { id: dbProduct.id },
      }).save();
    }
    return true;
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteProduct(@Arg("data") { id }: DeleteProductInput): Promise<
    boolean
  > {
    await Report.delete({ product: { id } });
    await Unit.delete({ product: { id } });
    await Product.delete({ id });
    return true;
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async updateProduct(
    @Arg("data") data: UpdateProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { units, ...rest } = data.newProduct;
    const userId = ctx.req.session!.passport.user.id;
    await Product.update({ id: data.id }, { ...rest, updatedById: userId });
    await Unit.delete({ product: { id: data.id } });
    for (const unit of units) {
      await Unit.create({
        ...unit,
        createdById: userId,
        updatedById: userId,
        product: { id: data.id },
      }).save();
    }
    return true;
  }

  @FieldResolver()
  async units(@Root() product: Product): Promise<Unit[]> {
    const { units } = await Product.findOneOrFail(
      { id: product.id },
      { relations: ["units"] },
    );
    return units;
  }

  @Authorized(Role.ADMIN)
  @FieldResolver()
  async reports(@Root() product: Product): Promise<Report[]> {
    const { reports } = await Product.findOneOrFail(
      { id: product.id },
      { relations: ["reports"] },
    );
    return reports;
  }

  @Authorized()
  @FieldResolver(() => Boolean)
  async hasBeenReportedByMe(
    @Root() product: Product,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const userId = ctx.req.session!.passport.user.id;
    const count = await Report.count({
      where: {
        product: {
          id: product.id,
        },
        creatorId: userId,
      },
    });
    return count === 1;
  }
}
