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
import { Unit } from "../entity/Unit";
import { Role } from "../helpers/authChecker";
import { ContextType } from "../types/ContextType";
import { ListWithCount, PaginationInput } from "../types/Pagination";
import { transformValidate } from "../helpers/validate";
import {
  MinLength,
  MaxLength,
  IsPositive,
  IsNumber,
  IsString,
} from "class-validator";

@ObjectType()
export class UnitsWithCount implements ListWithCount<Unit> {
  @Field(() => [Unit])
  items: Unit[];

  @Field()
  count: number;
}

@InputType()
export class UnitInput {
  @Field()
  @MinLength(1)
  @MaxLength(20)
  @IsString()
  name: string;

  @Field()
  @IsPositive()
  @IsNumber()
  energy: number;
}

@InputType()
class AddUnitInput {
  @Field(() => UnitInput)
  newUnit: UnitInput;

  @Field(() => ID)
  productId: number;
}

@InputType()
class GetUnitsByProductIdArgs {
  @Field(() => ID)
  productId: number;
}

@InputType()
class RemoveUnitInput {
  @Field(() => ID)
  id: number;
}

@InputType()
class GetUnitsByCreatedById {
  @Field(() => ID)
  id: number;
}

@InputType()
class GetUnitsByUpdatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Unit)
export class UnitResolver {
  @Authorized()
  @Query(() => UnitsWithCount)
  async getUnitsByProductId(
    @Arg("data") data: GetUnitsByProductIdArgs,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<UnitsWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    const { productId } = data;
    const [items, count] = await Unit.findAndCount({
      where: {
        product: { id: productId },
      },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Query(() => UnitsWithCount)
  async getUnitsByCreatedById(
    @Arg("data") data: GetUnitsByCreatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<UnitsWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Unit.findAndCount({
      where: { createdById: data.id },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Query(() => UnitsWithCount)
  async getUnitsByUpdatedById(
    @Arg("data") data: GetUnitsByUpdatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<UnitsWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Unit.findAndCount({
      where: { updatedById: data.id },
      take,
      skip,
      order: {
        id: "ASC",
      },
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
    await transformValidate(Unit, unit);
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
