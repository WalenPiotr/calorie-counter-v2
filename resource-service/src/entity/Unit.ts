import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Unit extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Product)
  @ManyToOne(() => Product, p => p.units)
  product: Product;

  @Field()
  @Column()
  energy: number;

  @Field(() => ID)
  @Column()
  createdById: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Field(() => ID)
  @Column()
  updatedById: number;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
