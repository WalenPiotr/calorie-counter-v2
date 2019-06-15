import { transformAndValidate } from "class-transformer-validator";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Product } from "../entity/Product";
import { Report, ReportReason, ReportStatus } from "../entity/Report";
import { Role } from "../helpers/authChecker";
import { ContextType } from "../types/ContextType";
import { ListWithCount, PaginationInput } from "../types/Pagination";

@ObjectType()
export class ReportsWithCount implements ListWithCount<Report> {
  @Field(() => [Report])
  items: Report[];

  @Field()
  count: number;
}

@InputType()
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

@InputType()
class GetReportsByCreatedById {
  @Field(() => ID)
  id: number;
}

@Resolver(Report)
export class ReportResolver {
  @Authorized(Role.ADMIN)
  @Query(() => ReportsWithCount)
  async getReports(
    @Arg("data") { productId }: GetReportArgs,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<ReportsWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Report.findAndCount({
      where: {
        product: {
          id: productId,
        },
      },
      take,
      skip,
      order: {
        id: "ASC",
      },
    });
    return { items, count };
  }

  @Authorized()
  @Query(() => ReportsWithCount)
  async getReportsByCreatedById(
    @Arg("data") data: GetReportsByCreatedById,
    @Arg("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<ReportsWithCount> {
    const { take, skip } = pagination
      ? await transformAndValidate(PaginationInput, pagination)
      : new PaginationInput();
    const [items, count] = await Report.findAndCount({
      where: { createdById: data.id },
      take,
      skip,
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
