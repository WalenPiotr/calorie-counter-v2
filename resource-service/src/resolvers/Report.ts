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
} from "type-graphql";
import { Report, ReportStatus } from "../entity/Report";
import { Role } from "../auth/authChecker";

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
}
