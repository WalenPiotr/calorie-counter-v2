import {
  Resolver,
  Query,
  Args,
  Ctx,
  ArgsType,
  Authorized,
  Mutation,
  Arg,
  InputType,
} from "type-graphql";
import { ContextType } from "../types/ContextType";
import { User } from "../entity/User";

@ArgsType()
class MeArgs {}

@InputType()
class UpdateMeInput {
  me: {
    displayName: string;
  };
}

@Resolver()
export class MeResolver {
  @Query(() => User)
  @Authorized()
  async me(@Args() _: MeArgs, @Ctx() ctx: ContextType): Promise<User> {
    const userId = ctx.req.session!.passport.user.id;
    return User.findOneOrFail({ id: userId });
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
