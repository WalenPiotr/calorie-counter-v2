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

@InputType()
class ProductInput {
  @Field()
  name: string;
}

@InputType()
class AddProductInput {
  @Field(() => ProductInput)
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

  @NestedField(() => ProductInput)
  newProduct: ProductInput;
}

@ArgsType()
class GetProductsByCreatedById {
  @Field()
  id: number;
}

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async searchProducts(@Args() args: SearchProductsArgs): Promise<Product[]> {
    return Product.createQueryBuilder()
      .where("LOWER(name) LIKE LOWER(:name)", { name: `%${args.name}%` })
      .getMany();
  }

  @Query(() => [Product])
  async getProductsByCreatedById(
    @Args() args: GetProductsByCreatedById,
  ): Promise<Product[]> {
    return Product.find({ createdById: args.id });
  }

  @Authorized()
  @ValidateInput("data", AddProductInput)
  @Mutation(() => Product)
  async addProduct(
    @Arg("data") data: AddProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Product> {
    const { newProduct } = data;
    const userId = ctx.req.session!.passport.user.id;
    const productPartial: Partial<Product> = {
      name: newProduct.name,
      createdById: userId,
      updatedById: userId,
    };
    const product = Product.fromObject(productPartial);
    await Product.validate(product);
    return Product.create(product).save();
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
  @ValidateInput("data", UpdateProductInput)
  @Mutation(() => Boolean)
  async updateProduct(
    @Arg("data") data: UpdateProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { newProduct, id } = data;
    const userId = ctx.req.session!.passport.user.id;
    const productPartial: Partial<Product> = {
      name: newProduct.name,
      updatedById: userId,
    };
    const product = await Product.fromObject(productPartial);
    await Product.validate(product);
    await Product.update({ id }, product);
    return true;
  }

  @FieldResolver(() => [Unit])
  async units(@Root() product: Product): Promise<Unit[]> {
    const { units } = await Product.findOneOrFail(
      { id: product.id },
      { relations: ["units"] },
    );
    return units;
  }

  @Authorized(Role.ADMIN)
  @FieldResolver(() => [Report])
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
