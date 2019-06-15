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
  ObjectType,
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

@ObjectType()
class UsersWithCount {
  @Field(() => User)
  items: User[];

  @Field()
  count: number;
}

@InputType()
class PaginationInput {
  @Field()
  take: number;

  @Field()
  skip: number;
}

@Resolver()
export class UserResolver {
  @Query(() => UsersWithCount)
  @Authorized([Role.ADMIN])
  async searchUser(
    @Arg("data") data: SearchUserArgs,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<UsersWithCount> {
    const [items, count] = await User.createQueryBuilder()
      .where("LOWER(email) LIKE LOWER(:email)", {
        email: `%${data.email}%`,
      })
      .orderBy({ id: "ASC" })
      .take(pagination.take)
      .skip(pagination.skip)
      .getManyAndCount();
    return { items, count };
  }

  @Query(() => User)
  @Authorized([Role.ADMIN])
  async getUserById(@Arg("data") data: GetUserArgs): Promise<User> {
    return User.findOneOrFail({ id: data.id });
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
