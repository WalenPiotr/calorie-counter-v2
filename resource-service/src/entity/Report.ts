import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
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
}
