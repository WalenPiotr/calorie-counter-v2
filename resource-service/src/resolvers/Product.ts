import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Product } from "../entity/Product";
import { Unit } from "../entity/Unit";
import { ContextType } from "../types/ContextType";

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

@Resolver(Product)
export class ProductResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello world";
  }
  @Authorized()
  @Mutation(() => Product, { nullable: true })
  async addProduct(
    @Arg("data") data: AddProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Product | undefined> {
    if (ctx.req.session) {
      const { user } = ctx.req.session.passport;
      console.log(user.id);
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
}
