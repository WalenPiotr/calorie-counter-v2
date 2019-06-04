import {
  Mutation,
  Arg,
  Resolver,
  Field,
  Query,
  ID,
  InputType,
  ArgsType,
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
class AddEntryInput {
  @Field(() => UnitInput)
  newUnit: UnitInput;

  @Field(() => ID)
  productId: number;
}

@ArgsType()
class GetEntryByMealIdArgs {
  @Field(() => ID)
  productId: number;
}

@InputType()
class RemoveEntryInput {
  @Field(() => ID)
  id: number;
}

@Resolver(Unit)
export class UnitResolver {
  @Query()
  async getUnitsByProductId(args: GetEntryByMealIdArgs): Promise<Unit[]> {
    const { productId } = args;
    return Unit.find({ product: { id: productId } });
  }

  @Mutation()
  async addUnit(
    @Arg("data") data: AddEntryInput,
    ctx: ContextType,
  ): Promise<Boolean> {
    const userId = ctx.req.session!.passport.user.id;
    const { newUnit } = data;
    const unit = Unit.fromObject({
      ...newUnit,
      createdById: userId,
      updatedById: userId,
    });
    await Unit.validate(unit);
    await Unit.create(unit).save();
    return true;
  }

  @Mutation()
  async removeEntry(@Arg("data") data: RemoveEntryInput): Promise<Boolean> {
    const { id } = data;
    await Unit.delete({ id: id });
    return true;
  }
}
