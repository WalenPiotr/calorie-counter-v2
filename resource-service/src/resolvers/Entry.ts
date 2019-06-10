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
} from "type-graphql";
import { ContextType } from "../types/ContextType";
import { Entry } from "../entity/Entry";
import { Meal } from "../entity/Meal";
import { Product } from "../entity/Product";

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

@Resolver(Entry)
export class EntryResolver {
  @Authorized()
  @Query(() => [Entry])
  async getEntriesByMealId(
    @Args() args: GetEntriesByMealId,
    @Ctx() ctx: ContextType,
  ): Promise<Entry[]> {
    const { mealId } = args;
    const userId = ctx.req.session!.passport.user.id;
    const entries = await Entry.find({
      meal: { id: mealId },
      createdById: userId,
    });
    return entries;
  }

  @Query(() => [Entry])
  async getEntriesByCreatedById(
    @Args() args: GetEntriesByCreatedById,
  ): Promise<Entry[]> {
    return Entry.find({ createdById: args.id });
  }

  @Authorized()
  @Mutation(() => Entry)
  async addEntry(
    @Arg("data") data: AddEntryInput,
    @Ctx() ctx: ContextType,
  ): Promise<Entry> {
    const userId = ctx.req.session!.passport.user.id;
    const { newEntry } = data;
    const entry = Entry.fromObject({
      quantity: newEntry.quantity,
      createdById: userId,
      updatedById: userId,
      meal: {
        id: newEntry.mealId,
      },
      product: {
        id: newEntry.productId,
      },
    });
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
