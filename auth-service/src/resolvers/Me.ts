import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User";
import { ContextType } from "../types/ContextType";

@InputType()
class MeInput {
  @Field()
  displayName: string;
}

@InputType()
class UpdateMeInput {
  @Field()
  me: MeInput;
}

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: ContextType): Promise<User | undefined> {
    if (
      ctx.req.session &&
      ctx.req.session.passport &&
      ctx.req.session.passport.user &&
      ctx.req.session.passport.user.id
    ) {
      return User.findOne({ id: ctx.req.session.passport.user.id });
    }
    return undefined;
  }

  @Mutation(() => Boolean)
  @Authorized()
  async updateMe(
    @Arg("data") input: UpdateMeInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const userId = ctx.req.session!.passport.user.id;
    await User.findOneOrFail({ id: userId });
    await User.validate(input.me);
    await User.update({ id: userId }, { ...input.me });
    return true;
  }
}
