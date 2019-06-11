import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  ID,
  Ctx,
  FieldResolver,
  Root,
} from "type-graphql";
import { Report, ReportStatus, ReportReason } from "../entity/Report";
import { Role } from "../helpers/authChecker";
import { ContextType } from "../types/ContextType";
import { Product } from "../entity/Product";

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
  productId: number;

  @Field(() => ReportReason)
  reason: ReportReason;

  @Field()
  message: string;
}

@ArgsType()
class GetReportsByCreatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Report)
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

  @Authorized()
  @Query(() => [Report])
  async getReportsByCreatedById(
    @Args() args: GetReportsByCreatedById,
  ): Promise<Report[]> {
    return Report.find({ createdById: args.id });
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
    const report = {
      product: {
        id: data.productId,
      },
      reason: data.reason,
      message: data.message,
      createdById: userId,
      status: ReportStatus.OPEN,
    };
    await Report.validate(report);
    await Report.create(report).save();
    return true;
  }

  @FieldResolver(() => Product)
  async product(@Root() report: Report) {
    const { product } = await Report.findOneOrFail(
      { id: report.id },
      { relations: ["product"] },
    );
    return product;
  }
}
