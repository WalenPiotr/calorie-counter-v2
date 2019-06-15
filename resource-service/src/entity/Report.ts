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
import { RecursivePartial } from "../types/RecursivePartial";

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
@Unique(["createdById", "product"])
export class Report extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ReportReason)
  @Column("int")
  reason: ReportReason;

  @Field()
  @Column()
  message: string;

  @Field(() => ReportStatus)
  @Column("int")
  status: ReportStatus;

  @Field(() => ID)
  @Column()
  createdById: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Product)
  @ManyToOne(() => Product, p => p.reports)
  product: Product;
}
