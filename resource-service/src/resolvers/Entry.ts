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
  @Query(() => [Entry])
  async getEntryByMealId(args: GetEntriesByMealId): Promise<Entry[]> {
    const { mealId } = args;
    return Entry.find({ meal: { id: mealId } });
  }

  @Mutation(() => Boolean)
  async addEntry(
    @Arg("data") data: AddEntryInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
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
    await Entry.create(entry).save();
    return true;
  }

  @Mutation(() => Boolean)
  async removeEntry(@Arg("data") data: RemoveEntryInput): Promise<Boolean> {
    const { id } = data;
    await Entry.delete({ id: id });
    return true;
  }
}
