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
} from "type-graphql";
import { ContextType } from "../types/ContextType";
import { Unit } from "../entity/Unit";
import { Role } from "../helpers/authChecker";
import { Product } from "../entity/Product";

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

@Resolver(Unit)
export class UnitResolver {
  @Authorized()
  @Query(() => [Unit])
  async getUnitsByProductId(
    @Args() args: GetUnitsByProductIdArgs,
  ): Promise<Unit[]> {
    const { productId } = args;
    return Unit.find({ product: { id: productId } });
  }

  @Query(() => [Unit])
  async getUnitsByCreatedById(
    @Args() args: GetUnitsByCreatedById,
  ): Promise<Unit[]> {
    return Unit.find({ createdById: args.id });
  }

  @Authorized()
  @Mutation(() => Unit)
  async addUnit(
    @Arg("data") data: AddUnitInput,
    @Ctx() ctx: ContextType,
  ): Promise<Unit> {
    const userId = ctx.req.session!.passport.user.id;
    const { newUnit, productId } = data;
    const unit = Unit.fromObject({
      ...newUnit,
      createdById: userId,
      updatedById: userId,
      product: {
        id: productId,
      },
    });
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
