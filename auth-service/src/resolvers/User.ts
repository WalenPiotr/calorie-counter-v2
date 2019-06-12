import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Role, Status, User } from "../entity/User";

@ArgsType()
class SearchUserArgs implements Partial<User> {
  @Field()
  email: string;
}

@ArgsType()
class GetUserArgs {
  @Field(() => ID)
  id: number;
}

@InputType()
class UserInput {
  @Field()
  displayName: string;

  @Field(() => Status)
  status: Status;

  @Field(() => Role)
  role: Role;
}

@InputType()
class UpdateUserInput {
  @Field(() => UserInput)
  user: UserInput;

  @Field(() => ID)
  id: number;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  @Authorized([Role.ADMIN])
  async searchUser(@Args() args: SearchUserArgs): Promise<User[]> {
    const users = await User.createQueryBuilder()
      .where("LOWER(email) LIKE LOWER(:email)", {
        email: `%${args.email}%`,
      })
      .getMany();
    return users;
  }

  @Query(() => User)
  @Authorized([Role.ADMIN])
  async getUserById(@Args() args: GetUserArgs): Promise<User> {
    return User.findOneOrFail({ id: args.id });
  }

  @Mutation(() => Boolean)
  @Authorized([Role.ADMIN])
  async updateUser(@Arg("data") input: UpdateUserInput): Promise<Boolean> {
    await User.findOneOrFail({ id: input.id });
    await User.validate(input.user);
    await User.update({ id: input.id }, { ...input.user });
    return true;
  }
}
