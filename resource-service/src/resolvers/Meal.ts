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
import { ContextType } from "src/types/ContextType";
import { Meal } from "src/entity/Meal";
import { Entry } from "src/entity/Entry";

@InputType()
class MealInput {
  @Field()
  name: string;
  @Field()
  date: Date;
}

@InputType()
class AddMealInput {
  @Field(() => MealInput)
  newMeal: MealInput;
}

@ArgsType()
class GetMealByDateArgs {
  @Field()
  date: Date;
}

@InputType()
class RemoveMealInput {
  @Field(() => ID)
  id: number;
}

@Resolver(Meal)
export class MealResolver {
  @Query()
  async getMealsByDate(args: GetMealByDateArgs): Promise<Meal[]> {
    return Meal.find({ date: args.date });
  }

  @Mutation()
  async addMeal(
    @Arg("data") data: AddMealInput,
    ctx: ContextType,
  ): Promise<Boolean> {
    const userId = ctx.req.session!.passport.user.id;
    const { newMeal } = data;
    const meal = Meal.fromObject({
      ...newMeal,
      createdById: userId,
      updatedById: userId,
    });
    await Meal.validate(meal);
    await Meal.create(meal).save();
    return true;
  }

  @Mutation()
  async removeMeal(@Arg("data") data: RemoveMealInput): Promise<Boolean> {
    const { id } = data;
    await Meal.delete({ id: id });
    await Entry.delete({ meal: { id: id } });
    return true;
  }
}
