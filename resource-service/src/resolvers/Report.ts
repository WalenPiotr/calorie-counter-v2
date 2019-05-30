import {
  Resolver,
  Query,
  Field,
  ArgsType,
  Args,
  Mutation,
  Authorized,
  InputType,
  Arg,
  Ctx,
  ID,
} from "type-graphql";
import { Report, ReportStatus, ReportReason } from "../entity/Report";
import { Role } from "../helpers/authChecker";
import { ContextType } from "../types/ContextType";

@ArgsType()
class GetReportArgs {
  @Field({ nullable: true })
  productId?: number;
}

@InputType()
class ValidateReportInput {
  @Field()
  id: number;

  @Field(() => ReportStatus)
  status: ReportStatus;
}

@InputType()
class ReportProductInput {
  @Field(() => ID)
  id: number;

  @Field(() => ReportReason)
  reason: ReportReason;

  @Field()
  message: string;
}

@Resolver()
export class ReportResolver {
  @Authorized(Role.ADMIN)
  @Query(() => Report)
  async getReports(@Args() { productId }: GetReportArgs): Promise<Report[]> {
    return await Report.find({
      where: {
        product: {
          id: productId,
        },
      },
    });
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => Boolean)
  async setReportStatus(@Arg("data")
  {
    id,
    status,
  }: ValidateReportInput): Promise<Boolean> {
    await Report.update({ id }, { status });
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async reportProduct(
    @Arg("data") data: ReportProductInput,
    @Ctx() ctx: ContextType,
  ): Promise<Boolean> {
    const userId = ctx.req.session!.passport.user.id;
    await Report.create({
      product: {
        id: data.id,
      },
      reason: data.reason,
      message: data.message,
      creatorId: userId,
      status: ReportStatus.OPEN,
    }).save();
    return true;
  }
}
