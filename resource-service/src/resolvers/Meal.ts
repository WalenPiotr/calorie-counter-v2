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
import { Meal } from "../entity/Meal";
import { ContextType } from "../types/ContextType";
import { ListWithCount, PaginationInput } from "../types/Pagination";
import { EntriesWithCount } from "./Entry";
import { transformValidate } from "../helpers/validate";

@ObjectType()
class MealsWithCount implements ListWithCount<Meal> {
  @Field(() => [Meal])
  items: Meal[];

  @Field()
  count: number;
}

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

@InputType()
class GetMealByDateArgs {
  @Field()
  date: Date;
}

@InputType()
class RemoveMealInput {
  @Field(() => ID)
  id: number;
}

@InputType()
class GetMealsByCreatedById {
  @Field(() => ID)
  id: number;
}

@InputType()
class GetMealsByUpdatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Meal)
export class MealResolver {
  @Authorized()
  @Query(() => MealsWithCount)
  async getMealsByDate(
    @Arg("data") data: GetMealByDateArgs,
    @Ctx() ctx: ContextType,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<MealsWithCount> {
    const userId = ctx.req.session!.passport.user.id;
    const { take, skip } = pagination ? pagination : new PaginationInput();
    const { date } = data;
    const [items, count] = await Meal.findAndCount({
      where: {
        date: new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        ),
        createdById: userId,
      },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized()
  @Query(() => MealsWithCount)
  async getMealsByCreatedById(
    @Arg("data") data: GetMealsByCreatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<MealsWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();

    const [items, count] = await Meal.findAndCount({
      where: { createdById: data.id },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized()
  @Query(() => MealsWithCount)
  async getMealsByUpdatedById(
    @Arg("data") data: GetMealsByUpdatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<MealsWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Meal.findAndCount({
      where: { createdById: data.id },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized()
  @Mutation(() => Meal)
  async addMeal(
    @Arg("data") data: AddMealInput,
    @Ctx() ctx: ContextType,
  ): Promise<Meal> {
    const userId = ctx.req.session!.passport.user.id;
    const { newMeal } = data;
    const { date } = newMeal;
    const meal = {
      ...newMeal,
      date: new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
      ),
      createdById: userId,
      updatedById: userId,
    };
    await transformValidate(Meal, meal);
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

  @FieldResolver(() => EntriesWithCount)
  async entries(
    @Root() meal: Meal,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<EntriesWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    console.log({ mealID: meal.id });
    const [items, count] = await Entry.findAndCount({
      where: {
        meal: { id: meal.id },
      },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    console.log({ entries: items });
    return { items, count };
  }
}
