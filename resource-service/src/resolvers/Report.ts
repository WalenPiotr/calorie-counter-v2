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
  ObjectType,
} from "type-graphql";
import { Report, ReportStatus, ReportReason } from "../entity/Report";
import { Role } from "../helpers/authChecker";
import { ContextType } from "../types/ContextType";
import { Product } from "../entity/Product";
import { ListWithCount, PaginationInput } from "src/types/Pagination";
import { ValidateInput } from "src/helpers/validate";

@ObjectType()
export class ReportsWithCount implements ListWithCount<Report> {
  @Field(() => [Report])
  items: Report[];

  @Field()
  count: number;
}

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
  @ValidateInput("pagination", PaginationInput)
  @Query(() => ReportsWithCount)
  async getReports(
    @Arg("data") { productId }: GetReportArgs,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<ReportsWithCount> {
    const [items, count] = await Report.findAndCount({
      where: {
        product: {
          id: productId,
        },
      },
      take: pagination.take,
      skip: pagination.skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized()
  @ValidateInput("pagination", PaginationInput)
  @Query(() => ReportsWithCount)
  async getReportsByCreatedById(
    @Arg("data") data: GetReportsByCreatedById,
    @Arg("pagination") pagination: PaginationInput,
  ): Promise<ReportsWithCount> {
    const [items, count] = await Report.findAndCount({
      where: { createdById: data.id },
      take: pagination.take,
      skip: pagination.skip,
      order: { id: "ASC" },
    });
    return { items, count };
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
