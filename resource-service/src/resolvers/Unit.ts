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
} from "type-graphql";
import { ContextType } from "../types/ContextType";
import { Unit } from "../entity/Unit";

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

@Resolver(Unit)
export class UnitResolver {
  @Query(() => [Unit])
  async getUnitsByProductId(args: GetUnitsByProductIdArgs): Promise<Unit[]> {
    const { productId } = args;
    return Unit.find({ product: { id: productId } });
  }

  @Mutation(() => Boolean)
  async addUnit(
    @Arg("data") data: AddUnitInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
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
    await Unit.create(unit).save();
    return true;
  }

  @Mutation(() => Boolean)
  async removeEntry(@Arg("data") data: RemoveUnitInput): Promise<Boolean> {
    const { id } = data;
    await Unit.delete({ id: id });
    return true;
  }
}
