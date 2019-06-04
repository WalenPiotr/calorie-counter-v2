import {
  Field,
  ID,
  ObjectType,
  registerEnumType,
  ArgumentValidationError,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Product } from "./Product";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export enum ReportStatus {
  OPEN,
  CLOSED,
}
registerEnumType(ReportStatus, {
  name: "ReportStatus",
});

export enum ReportReason {
  SPAM,
  VULGAR,
  INVALID,
  INVALID_BASE,
  INVALID_UNIT,
}
registerEnumType(ReportReason, {
  name: "ReportReason",
});

@Entity()
@ObjectType()
@Unique(["creatorId", "product"])
export class Report extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  creatorId: number;

  @Field(() => ReportReason)
  @Column("int")
  reason: ReportReason;

  @Field()
  @Column()
  message: string;

  @Field(() => ReportStatus)
  @Column("int")
  status: ReportStatus;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Product)
  @ManyToOne(() => Product, p => p.reports)
  product: Product;

  static async validate(obj: Report) {
    const errors = await validate(obj);
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
  }

  static fromObject(obj: any) {
    return plainToClass(Report, obj);
  }
}
