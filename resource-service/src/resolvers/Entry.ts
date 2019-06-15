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
import { Product } from "../entity/Product";
import { ContextType } from "../types/ContextType";
import { ListWithCount, PaginationInput } from "../types/Pagination";
import { transformAndValidate } from "class-transformer-validator";

@ObjectType()
export class EntriesWithCount implements ListWithCount<Entry> {
  @Field(() => [Entry])
  items: Entry[];

  @Field()
  count: number;
}

@InputType()
class EntryInput {
  @Field(() => ID)
  productId: number;

  @Field(() => ID)
  mealId: number;

  @Field()
  quantity: number;
}

@InputType()
class AddEntryInput {
  @Field(() => EntryInput)
  newEntry: EntryInput;
}

@InputType()
class GetEntriesByMealId {
  @Field(() => ID)
  mealId: number;
}

@InputType()
class RemoveEntryInput {
  @Field(() => ID)
  id: number;
}

@InputType()
class GetEntriesByCreatedById {
  @Field(() => ID)
  id: number;
}

@InputType()
class GetEntriesByUpdatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Entry)
export class EntryResolver {
  @Authorized()
  @Query(() => EntriesWithCount)
  async getMyEntriesByMealId(
    @Arg("data") data: GetEntriesByMealId,
    @Ctx() ctx: ContextType,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<EntriesWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const { mealId } = data;
    const userId = ctx.req.session!.passport.user.id;
    const [items, count] = await Entry.findAndCount({
      where: {
        meal: { id: mealId },
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
  @Query(() => EntriesWithCount)
  async getEntriesByCreatedById(
    @Arg("data") data: GetEntriesByCreatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<EntriesWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Entry.findAndCount({
      where: { createdById: data.id },
      take,
      skip,
      order: { id: "ASC" },
    });
    return { items, count };
  }

  @Authorized()
  @Query(() => EntriesWithCount)
  async getEntriesByUpdatedById(
    @Arg("data") data: GetEntriesByUpdatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<EntriesWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Entry.findAndCount({
      where: { createdById: data.id },
      take,
      skip,
      order: { id: "ASC" },
    });
    return { items, count };
  }

  @Authorized()
  @Mutation(() => Entry)
  async addEntry(
    @Arg("data") data: AddEntryInput,
    @Ctx() ctx: ContextType,
  ): Promise<Entry> {
    const userId = ctx.req.session!.passport.user.id;
    const { newEntry } = data;
    const entry = {
      quantity: newEntry.quantity,
      createdById: userId,
      updatedById: userId,
      meal: {
        id: newEntry.mealId,
      },
      product: {
        id: newEntry.productId,
      },
    };
    await Entry.validate(entry);
    return Entry.create(entry).save();
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeEntry(
    @Arg("data") data: RemoveEntryInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const { id } = data;
    const userId = ctx.req.session!.passport.user.id;
    await Entry.delete({ id: id, createdById: userId });
    return true;
  }

  @FieldResolver(() => Meal)
  async meal(@Root() entry: Entry): Promise<Meal> {
    const { meal } = await Entry.findOneOrFail(
      { id: entry.id },
      { relations: ["meal"] },
    );
    return meal;
  }

  @FieldResolver(() => Product)
  async product(@Root() entry: Entry): Promise<Product> {
    const { product } = await Entry.findOneOrFail(
      { id: entry.id },
      { relations: ["product"] },
    );
    return product;
  }
}
