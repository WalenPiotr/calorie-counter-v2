import {
  Arg,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver,
  Args,
  FieldResolver,
  Root,
} from "type-graphql";
import { Entry } from "../entity/Entry";
import { Meal } from "../entity/Meal";
import { ContextType } from "../types/ContextType";

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
  @Authorized()
  @Query(() => [Meal])
  async getMealsByDate(
    @Args() args: GetMealByDateArgs,
    @Ctx() ctx: ContextType,
  ): Promise<Meal[]> {
    const userId = ctx.req.session!.passport.user.id;
    return Meal.find({ date: args.date, createdById: userId });
  }

  @Authorized()
  @Mutation(() => Meal)
  async addMeal(
    @Arg("data") data: AddMealInput,
    @Ctx() ctx: ContextType,
  ): Promise<Meal> {
    const userId = ctx.req.session!.passport.user.id;
    const { newMeal } = data;
    const meal = Meal.fromObject({
      ...newMeal,
      createdById: userId,
      updatedById: userId,
    });
    await Meal.validate(meal);
    return Meal.create(meal).save();
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeMeal(
    @Arg("data") data: RemoveMealInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { id } = data;
    const userId = ctx.req.session!.passport.user.id;
    await Meal.delete({ id: id, createdById: userId });
    await Entry.delete({ meal: { id: id, createdById: userId } });
    return true;
  }

  @FieldResolver(() => [Entry])
  async entries(@Root() meal: Meal): Promise<Entry[]> {
    const { entries } = await Meal.findOneOrFail(
      { id: meal.id },
      { relations: ["entries"] },
    );
    return entries;
  }
}
