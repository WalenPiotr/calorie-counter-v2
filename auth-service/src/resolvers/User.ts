import { Max, Min } from "class-validator";
import {
  Arg,
  Authorized,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Role, Status, User } from "../entity/User";
import { transformValidate } from "../helpers/validate";

@InputType()
class SearchUserInput implements Partial<User> {
  @Field()
  email: string;
}

@InputType()
class GetUserInput {
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
  @Field(() => Int)
  @Min(0)
  skip: number = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}

@Resolver()
export class UserResolver {
  @Query(() => UsersWithCount)
  @Authorized([Role.ADMIN])
  async searchUser(
    @Arg("data") data: SearchUserInput,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<UsersWithCount> {
    const { take, skip } = pagination
      ? await transformValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await User.createQueryBuilder()
      .where("LOWER(email) LIKE LOWER(:email)", {
        email: `%${data.email}%`,
      })
      .orderBy({ id: "ASC" })
      .take(take)
      .skip(skip)
      .getManyAndCount();
    return { items, count };
  }

  @Query(() => User)
  @Authorized([Role.ADMIN])
  async getUserById(@Arg("data") data: GetUserInput): Promise<User> {
    return User.findOneOrFail({ id: data.id });
  }

  @Mutation(() => Boolean)
  @Authorized([Role.ADMIN])
  async updateUser(@Arg("data") input: UpdateUserInput): Promise<Boolean> {
    await User.findOneOrFail({ id: input.id });
    await transformValidate(User, input.user);
    await User.update({ id: input.id }, { ...input.user });
    return true;
  }
}
