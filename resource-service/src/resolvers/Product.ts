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
import { Report, ReportStatus, ReportReason } from "../entity/Report";

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

@InputType()
class UpdateProductInput {
  @Field(() => ID)
  id: number;

  @Field(() => ProductInput)
  newProduct: ProductInput;
}

@InputType()
class UpdateProductsUnitsInput {
  @Field(() => ID)
  id: number;

  @Field(() => [UnitInput])
  newUnits: UnitInput[];
}

@InputType()
class ReportProductInput {
  @Field(() => ID)
  id: number;

  @Field(() => ReportReason)
  reason: ReportReason;

  @Field()
  message: string;
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
  @Mutation(() => Product, { nullable: true })
  async addProduct(
    @Arg("data") data: AddProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Product | undefined> {
    const { id } = ctx.req.session!.passport.user;
    let units: Unit[] = [];
    for (const unit of data.units) {
      const dbUnit = await Unit.create({
        ...unit,
        createdById: id,
        updatedById: id,
      }).save();
      units = units.concat(dbUnit);
    }
    const dbProduct = await Product.create({
      ...data.product,
      units: units,
      createdById: id,
      updatedById: id,
    }).save();
    return dbProduct;
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

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async updateProductUnits(
    @Arg("data") data: UpdateProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { id } = ctx.req.session!.passport.user;
    await Product.update(
      { id: data.id },
      { ...data.newProduct, updatedById: id },
    );
    return true;
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async updateProductsUnits(
    @Arg("data") data: UpdateProductsUnitsInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { id } = ctx.req.session!.passport.user;
    Unit.delete({ product: { id: data.id } });
    let units: Unit[] = [];
    for (const unit of data.newUnits) {
      const dbUnit = await Unit.create({
        ...unit,
        updatedById: id,
      }).save();
      units = units.concat(dbUnit);
    }
    await Product.update({ id: data.id }, { units, updatedById: id });
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async reportProduct(
    @Arg("data") data: ReportProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const userId = ctx.req.session!.passport.user;
    const count = await Report.count({
      creatorId: userId,
      product: { id: data.id },
    });
    if (count > 0) {
      throw new Error("Product has been already reported");
    }
    const report = await Report.create({
      reason: data.reason,
      message: data.message,
      creatorId: userId,
      status: ReportStatus.OPEN,
    }).save();
    const product = await Product.findOneOrFail(
      { id: data.id },
      { relations: ["reports"] },
    );
    await Product.update(
      { id: data.id },
      {
        reports: [...product.reports, report],
      },
    );
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
    const userId = ctx.req.session!.passport.user;
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
