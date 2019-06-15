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
  ObjectType,
} from "type-graphql";
import { Entry } from "../entity/Entry";
import { Meal } from "../entity/Meal";
import { ContextType } from "../types/ContextType";
import { PaginationInput, ListWithCount } from "src/types/Pagination";
import { ValidateInput } from "src/helpers/validate";
import { EntriesWithCount } from "./Entry";

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

@ArgsType()
class GetMealsByCreatedById {
  @Field(() => ID)
  id: number;
}

@ArgsType()
class GetMealsByUpdatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Meal)
export class MealResolver {
  @Authorized()
  @ValidateInput("pagination", PaginationInput)
  @Query(() => [Meal])
  async getMealsByDate(
    @Arg("data") data: GetMealByDateArgs,
    @Arg("pagination") pagination: PaginationInput,
    @Ctx() ctx: ContextType,
  ): Promise<MealsWithCount> {
    const userId = ctx.req.session!.passport.user.id;
    const [items, count] = await Meal.findAndCount({
      where: { date: data.date, createdById: userId },
      take: pagination.take,
      skip: pagination.skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized()
  @ValidateInput("pagination", PaginationInput)
  @Query(() => MealsWithCount)
  async getMealsByCreatedById(
    @Arg("data") data: GetMealsByCreatedById,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<MealsWithCount> {
    const [items, count] = await Meal.findAndCount({
      where: { createdById: data.id },
      take: pagination.take,
      skip: pagination.skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized()
  @ValidateInput("pagination", PaginationInput)
  @Query(() => MealsWithCount)
  async getMealsByUpdatedById(
    @Arg("data") data: GetMealsByUpdatedById,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<MealsWithCount> {
    const [items, count] = await Meal.findAndCount({
      where: { createdById: data.id },
      take: pagination.take,
      skip: pagination.skip,
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
    const meal = {
      ...newMeal,
      createdById: userId,
      updatedById: userId,
    };
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

  @FieldResolver(() => EntriesWithCount)
  async entries(
    @Root() meal: Meal,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<EntriesWithCount> {
    const [items, count] = await Entry.findAndCount({
      where: {
        meal: { id: meal.id },
      },
      take: pagination.take,
      skip: pagination.skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }
}
