import { transformAndValidate } from "class-transformer-validator";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Entry } from "../entity/Entry";
import { Product } from "../entity/Product";
import { Report } from "../entity/Report";
import { Unit } from "../entity/Unit";
import { Role } from "../helpers/authChecker";
import { ContextType } from "../types/ContextType";
import { ListWithCount, PaginationInput } from "../types/Pagination";
import { EntriesWithCount } from "./Entry";
import { ReportsWithCount } from "./Report";
import { UnitsWithCount } from "./Unit";

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

@InputType()
class SearchProductsInput {
  @Field()
  name: string;
}

@ObjectType()
class ProductsWithCount implements ListWithCount<Product> {
  @Field()
  count: number;

  @Field(() => [Product])
  items: Product[];
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

@InputType()
class GetProductsByCreatedById {
  @Field(() => ID)
  id: number;
}

@InputType()
class GetProductsByUpdatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Product)
export class ProductResolver {
  @Query(() => ProductsWithCount)
  async searchProducts(
    @Arg("data") data: SearchProductsInput,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<ProductsWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [products, count] = await Product.createQueryBuilder()
      .where("LOWER(name) LIKE LOWER(:name)", { name: `%${data.name}%` })
      .orderBy({ id: "ASC" })
      .take(take)
      .skip(skip)
      .getManyAndCount();
    return { items: products, count };
  }

  @Query(() => ProductsWithCount)
  async getProductsByCreatedById(
    @Arg("data") data: GetProductsByCreatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<ProductsWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Product.findAndCount({
      where: { createdById: data.id },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return {
      items,
      count,
    };
  }

  @Query(() => ProductsWithCount)
  async getProductsByUpdatedById(
    @Arg("data") data: GetProductsByUpdatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<ProductsWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Product.findAndCount({
      where: { updatedById: data.id },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return {
      items,
      count,
    };
  }

  @Authorized()
  @Mutation(() => Product)
  async addProduct(
    @Arg("data") data: AddProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Product> {
    const { newProduct } = data;
    const userId = ctx.req.session!.passport.user.id;
    const product: Partial<Product> = {
      name: newProduct.name,
      createdById: userId,
      updatedById: userId,
    };
    await transformAndValidate(Product, product);
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
  @Mutation(() => Boolean)
  async updateProduct(
    @Arg("data") data: UpdateProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { newProduct, id } = data;
    const userId = ctx.req.session!.passport.user.id;
    const product: Partial<Product> = {
      name: newProduct.name,
      updatedById: userId,
    };
    await transformAndValidate(Product, product);
    await Product.update({ id }, product);
    return true;
  }

  @FieldResolver(() => UnitsWithCount)
  async units(
    @Root() product: Product,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<UnitsWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Unit.findAndCount({
      where: { product: { id: product.id } },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized(Role.ADMIN)
  @FieldResolver(() => ReportsWithCount)
  async reports(
    @Root() product: Product,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<ReportsWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Report.findAndCount({
      where: { product: { id: product.id } },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized(Role.ADMIN)
  @FieldResolver(() => EntriesWithCount)
  async entries(
    @Root() product: Product,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<EntriesWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Entry.findAndCount({
      where: { product: { id: product.id } },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
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
