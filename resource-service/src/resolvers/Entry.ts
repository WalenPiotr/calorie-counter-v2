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
} from "type-graphql";
import { ContextType } from "../types/ContextType";
import { Entry } from "../entity/Entry";

@InputType()
class EntryInput {
  @Field()
  name: string;
  @Field()
  date: Date;
}

@InputType()
class AddEntryInput {
  @Field(() => EntryInput)
  newEntry: EntryInput;

  @Field(() => ID)
  mealId: number;
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

@Resolver(Entry)
export class EntryResolver {
  @Authorized()
  @Query(() => [Entry])
  async getEntryByMealId(
    @Args() args: GetEntriesByMealId,
    @Ctx() ctx: ContextType,
  ): Promise<Entry[]> {
    const { mealId } = args;
    const userId = ctx.req.session!.passport.user.id;
    return Entry.find({ meal: { id: mealId }, createdById: userId });
  }

  @Authorized()
  @Mutation(() => Entry)
  async addEntry(
    @Arg("data") data: AddEntryInput,
    @Ctx() ctx: ContextType,
  ): Promise<Entry> {
    const userId = ctx.req.session!.passport.user.id;
    const { newEntry, mealId } = data;
    const entry = Entry.fromObject({
      ...newEntry,
      createdById: userId,
      updatedById: userId,
      meal: {
        id: mealId,
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
}
