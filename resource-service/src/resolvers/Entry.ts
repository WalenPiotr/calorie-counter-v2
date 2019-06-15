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
  Args,
  Authorized,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { ContextType } from "../types/ContextType";
import { Entry } from "../entity/Entry";
import { Meal } from "../entity/Meal";
import { Product } from "../entity/Product";
import { ListWithCount, PaginationInput } from "src/types/Pagination";
import { ValidateInput } from "src/helpers/validate";

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

@ArgsType()
class GetEntriesByMealId {
  @Field(() => ID)
  mealId: number;
}

@InputType()
class RemoveEntryInput {
  @Field(() => ID)
  id: number;
}

@ArgsType()
class GetEntriesByCreatedById {
  @Field(() => ID)
  id: number;
}

@ArgsType()
class GetEntriesByUpdatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Entry)
export class EntryResolver {
  @Authorized()
  @ValidateInput("pagination", PaginationInput)
  @Query(() => EntriesWithCount)
  async getMyEntriesByMealId(
    @Arg("data") data: GetEntriesByMealId,
    @Ctx() ctx: ContextType,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<EntriesWithCount> {
    const { mealId } = data;
    const userId = ctx.req.session!.passport.user.id;
    const [items, count] = await Entry.findAndCount({
      where: {
        meal: { id: mealId },
        createdById: userId,
      },
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
  @Query(() => EntriesWithCount)
  async getEntriesByCreatedById(
    @Arg("data") data: GetEntriesByCreatedById,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<EntriesWithCount> {
    const [items, count] = await Entry.findAndCount({
      where: { createdById: data.id },
      take: pagination.take,
      skip: pagination.skip,
      order: { id: "ASC" },
    });
    return { items, count };
  }

  @Authorized()
  @ValidateInput("pagination", PaginationInput)
  @Query(() => EntriesWithCount)
  async getEntriesByUpdatedById(
    @Arg("data") data: GetEntriesByUpdatedById,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<EntriesWithCount> {
    const [items, count] = await Entry.findAndCount({
      where: { createdById: data.id },
      take: pagination.take,
      skip: pagination.skip,
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
