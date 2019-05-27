import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { registerEnumType } from "type-graphql";

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
  @OneToMany(() => Product, p => p.reports)
  product: Product;
}
