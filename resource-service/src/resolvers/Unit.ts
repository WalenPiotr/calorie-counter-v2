import {
  Mutation,
  Arg,
  Resolver,
  Field,
  Query,
  ID,
  InputType,
  ArgsType,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
  Args,
  ObjectType,
} from "type-graphql";
import { ContextType } from "../types/ContextType";
import { Unit } from "../entity/Unit";
import { Role } from "../helpers/authChecker";
import { Product } from "../entity/Product";
import { ListWithCount, PaginationInput } from "src/types/Pagination";
import { ValidateInput } from "src/helpers/validate";

@ObjectType()
export class UnitsWithCount implements ListWithCount<Unit> {
  @Field(() => [Unit])
  items: Unit[];

  @Field()
  count: number;
}

@InputType()
class UnitInput {
  @Field()
  name: string;

  @Field()
  energy: number;
}

@InputType()
class AddUnitInput {
  @Field(() => UnitInput)
  newUnit: UnitInput;

  @Field(() => ID)
  productId: number;
}

@ArgsType()
class GetUnitsByProductIdArgs {
  @Field(() => ID)
  productId: number;
}

@InputType()
class RemoveUnitInput {
  @Field(() => ID)
  id: number;
}

@ArgsType()
class GetUnitsByCreatedById {
  @Field(() => ID)
  id: number;
}

@ArgsType()
class GetUnitsByUpdatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Unit)
export class UnitResolver {
  @Authorized()
  @ValidateInput("pagination", PaginationInput)
  @Query(() => UnitsWithCount)
  async getUnitsByProductId(
    @Arg("data") data: GetUnitsByProductIdArgs,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<UnitsWithCount> {
    const { productId } = data;
    const [items, count] = await Unit.findAndCount({
      where: {
        product: { id: productId },
      },
      take: pagination.take,
      skip: pagination.skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Query(() => UnitsWithCount)
  async getUnitsByCreatedById(
    @Arg("data") data: GetUnitsByCreatedById,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<UnitsWithCount> {
    const [items, count] = await Unit.findAndCount({
      where: { createdById: data.id },
      take: pagination.take,
      skip: pagination.skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Query(() => UnitsWithCount)
  async getUnitsByUpdatedById(
    @Arg("data") data: GetUnitsByUpdatedById,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<UnitsWithCount> {
    const [items, count] = await Unit.findAndCount({
      where: { updatedById: data.id },
      take: pagination.take,
      skip: pagination.skip,
    });
    return { items, count };
  }

  @Authorized()
  @Mutation(() => Unit)
  async addUnit(
    @Arg("data") data: AddUnitInput,
    @Ctx() ctx: ContextType,
  ): Promise<Unit> {
    const userId = ctx.req.session!.passport.user.id;
    const { newUnit, productId } = data;
    const unit = {
      ...newUnit,
      createdById: userId,
      updatedById: userId,
      product: {
        id: productId,
      },
    };
    await Unit.validate(unit);
    return Unit.create(unit).save();
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async removeUnit(@Arg("data") data: RemoveUnitInput): Promise<Boolean> {
    const { id } = data;
    await Unit.delete({ id: id });
    return true;
  }

  @FieldResolver(() => Product)
  async product(@Root() report: Unit) {
    const { product } = await Unit.findOneOrFail(
      { id: report.id },
      { relations: ["product"] },
    );
    return product;
  }
}
