import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Product])
  @ManyToOne(() => Product, p => p.entries)
  @JoinTable()
  product: Product;

  @Field()
  @Column()
  quantity: number;

  @Field(() => ID)
  createdById: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Field(() => ID)
  updatedById: number;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
