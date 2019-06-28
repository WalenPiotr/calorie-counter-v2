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
// @InputType()
// class GetDaysWithMyMeals {}

@ObjectType()
class DaysWithCount {
  @Field()
  count: number;

  @Field(() => [Day])
  items: Day[];
}

@ObjectType()
class Day {
  @Field(() => Date)
  date: Date;

  @Field()
  mealCount: number;

  @Field()
  total: number;
}

@Resolver(Meal)
export class MealResolver {
  @Authorized()
  @Query(() => Number)
  async getMyEnergyValue(@Ctx() ctx: ContextType): Promise<number> {
    const userId = ctx.req.session!.passport.user.id;
    const date = new Date();
    const meals = await Meal.getRepository().find({
      where: {
        date: new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        ),
        createdById: userId,
      },
      relations: ["entries", "entries.unit"],
      take: 100,
      skip: 0,
    });
    return meals.reduce(
      (subtotal: number, curr: Meal) =>
        subtotal +
        (curr.entries
          ? curr.entries.reduce(
              (partialSum: number, curr: Entry) =>
                partialSum + curr.unit.energy * curr.quantity,
              0,
            )
          : 0),
      0,
    );
  }

  @Authorized()
  @Query(() => DaysWithCount)
  async getDaysWithMyMeals(
    // @Arg("data") _: GetDaysWithMyMeals,
    @Ctx() ctx: ContextType,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<DaysWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    const userId = ctx.req.session!.passport.user.id;
    const results = await Meal.query(
      `
        (SELECT 
          "date" as date, 
          COUNT(*) as mealCount
        FROM Meal
        WHERE "createdById"=$1
        GROUP BY "date"
        ORDER BY "date"
        OFFSET $2 
        LIMIT $3);
      `,
      [userId, skip, take],
    );
    const { count } = await Meal.createQueryBuilder()
      .select(`COUNT(DISTINCT("date"))`, "count")
      .where({
        createdById: userId,
      })
      .getRawOne();

    let newResults: Day[] = [];
    for (const r of results) {
      const date = new Date(r.date);
      const mealCount = parseInt(r.mealcount);
      const meals = await Meal.getRepository().find({
        where: {
          date: r.date,
          createdById: userId,
        },
        relations: ["entries", "entries.unit"],
        take: 1000,
        skip: 0,
      });
      const total = meals.reduce(
        (subtotal: number, curr: Meal) =>
          subtotal +
          (curr.entries
            ? curr.entries.reduce(
                (partialSum: number, curr: Entry) =>
                  partialSum + curr.unit.energy * curr.quantity,
                0,
              )
            : 0),
        0,
      );
      newResults = [
        ...newResults,
        {
          mealCount,
          date,
          total,
        },
      ];
    }
    return { items: newResults, count };
  }

  @Authorized()
  @Query(() => MealsWithCount)
  async getMealsByDate(
    @Arg("data") data: GetMealByDateArgs,
    @Ctx() ctx: ContextType,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<MealsWithCount> {
    const userId = ctx.req.session!.passport.user.id;
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
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
