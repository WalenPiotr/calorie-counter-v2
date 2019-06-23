import { MaxLength, MinLength } from "class-validator";
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
import { Product } from "../entity/Product";
import { Report } from "../entity/Report";
import { Unit } from "../entity/Unit";
import { Role } from "../helpers/authChecker";
import { NestedField, transformValidate } from "../helpers/validate";
import { ContextType } from "../types/ContextType";
import { ListWithCount, PaginationInput } from "../types/Pagination";
import { ReportsWithCount } from "./Report";
import { UnitInput, UnitsWithCount } from "./Unit";
import { Entry } from "../entity/Entry";

@InputType()
class ProductInput {
  @Field()
  @MinLength(3)
  @MaxLength(20)
  name: string;
}

@InputType()
class AddProductInput {
  @Field(() => ProductInput)
  newProduct: ProductInput;
}

@InputType()
export class AddProductWithUnitsInput {
  @NestedField(() => ProductInput)
  newProduct: ProductInput;

  @Field(() => UnitInput)
  newUnits: UnitInput[];
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
class UpdateProductWithUnitsInput {
  @Field(() => ID)
  id: number;

  @Field(() => ProductInput)
  newProduct: ProductInput;

  @Field(() => UnitInput)
  newUnits: UnitInput[];
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

@InputType()
class GetProductInput {
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
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [products, count] = await Product.createQueryBuilder()
      .where("LOWER(name) LIKE LOWER(:name)", { name: `%${data.name}%` })
      .orderBy({ id: "ASC" })
      .take(take)
      .skip(skip)
      .getManyAndCount();
    return { items: products, count };
  }

  @Query(() => Product)
  async getProduct(@Arg("data") data: GetProductInput) {
    return Product.findOneOrFail({ id: data.id });
  }

  @Query(() => ProductsWithCount)
  async getProductsByCreatedById(
    @Arg("data") data: GetProductsByCreatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<ProductsWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
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
      ? await transformValidate(PaginationInput, pagination)
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
    await transformValidate(Product, product);
    return Product.create(product).save();
  }

  @Authorized()
  @Mutation(() => Product)
  async addProductWithUnits(
    @Arg("data") data: AddProductWithUnitsInput,
    @Ctx() ctx: ContextType,
  ): Promise<Product> {
    await transformValidate(AddProductWithUnitsInput, data);
    const userId = ctx.req.session!.passport.user.id;
    const { newProduct, newUnits } = data;
    const product: Partial<Product> = {
      name: newProduct.name,
      createdById: userId,
      updatedById: userId,
    };
    let productId: null | number = null;

    await transformValidate(Product, product);
    for (const newUnit of newUnits) {
      const unit = {
        ...newUnit,
        createdById: userId,
        updatedById: userId,
        product: {
          id: productId,
        },
      };
      await transformValidate(Unit, unit);
    }
    const dbProduct = await Product.create(product).save();
    productId = dbProduct.id;
    for (const newUnit of newUnits) {
      const unit = {
        ...newUnit,
        createdById: userId,
        updatedById: userId,
        product: {
          id: productId,
        },
      };
      Unit.create(unit).save();
    }
    return Product.findOneOrFail({ id: productId }, { relations: ["units"] });
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
    await transformValidate(Product, product);
    await Product.update({ id }, product);
    return true;
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async updateProductWithUnits(
    @Arg("data") data: UpdateProductWithUnitsInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    await transformValidate(UpdateProductWithUnitsInput, data);
    const { newProduct, newUnits, id } = data;
    const userId = ctx.req.session!.passport.user.id;
    const product: Partial<Product> = {
      name: newProduct.name,
      updatedById: userId,
    };
    await transformValidate(Product, product);
    for (const newUnit of newUnits) {
      const unit = {
        ...newUnit,
        createdById: userId,
        updatedById: userId,
        product: {
          id,
        },
      };
      await transformValidate(Unit, unit);
    }
    const oldUnits = await Unit.find({ product: { id } });
    for (const oldUnit of oldUnits) {
      await Entry.delete({ unit: { id: oldUnit.id } });
    }
    await Product.update({ id }, product);
    await Unit.delete({
      product: {
        id,
      },
    });
    for (const newUnit of newUnits) {
      const unit = {
        ...newUnit,
        createdById: userId,
        updatedById: userId,
        product: {
          id,
        },
      };
      Unit.create(unit).save();
    }
    return true;
  }

  @FieldResolver(() => UnitsWithCount)
  async units(
    @Root() product: Product,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<UnitsWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
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
      ? await transformValidate(PaginationInput, pagination)
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
