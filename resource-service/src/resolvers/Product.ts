import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  Args,
  ArgsType,
  FieldResolver,
  Root,
  ID,
} from "type-graphql";
import { Product } from "../entity/Product";
import { Unit } from "../entity/Unit";
import { ContextType } from "../types/ContextType";
import { Role } from "../auth/authChecker";

@InputType()
class ProductInput implements Partial<Product> {
  @Field()
  name: string;
}

@InputType()
class UnitInput implements Partial<Product> {
  @Field()
  name: string;

  @Field()
  energy: number;
}

@InputType()
class AddProductInput {
  @Field(() => ProductInput)
  product: ProductInput;

  @Field(() => [UnitInput])
  units: UnitInput[];
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

@Resolver(Product)
export class ProductResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello world";
  }

  @Query(() => [Product])
  async searchProducts(@Args() args: SearchProductsArgs): Promise<Product[]> {
    return Product.createQueryBuilder()
      .where("LOWER(name) LIKE LOWER(:name)", { name: `%${args.name}%` })
      .getMany();
  }

  @Authorized()
  @Mutation(() => Product, { nullable: true })
  async addProduct(
    @Arg("data") data: AddProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Product | undefined> {
    if (ctx.req.session) {
      const { user } = ctx.req.session.passport;
      let units: Unit[] = [];
      for (const unit of data.units) {
        const dbUnit = await Unit.create({
          ...unit,
          createdById: user.id as number,
          updatedById: user.id as number,
        }).save();
        units = units.concat(dbUnit);
      }
      const dbProduct = await Product.create({
        ...data.product,
        units: units,
        createdById: user.id as number,
        updatedById: user.id as number,
      }).save();
      return dbProduct;
    }
    throw new Error("No user in session");
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteProduct(@Arg("data") { id }: DeleteProductInput): Promise<
    boolean
  > {
    await Unit.delete({ product: { id } });
    await Product.delete({ id });
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
}
