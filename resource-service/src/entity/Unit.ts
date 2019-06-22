import { IsPositive, MaxLength, MinLength } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./Product";
import { Entry } from "./Entry";

@ObjectType()
@Entity()
@Unique(["product", "name", "energy"])
export class Unit extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @MinLength(1)
  @MaxLength(20)
  name: string;

  @Field(() => Product)
  @ManyToOne(() => Product, p => p.units)
  product: Product;

  @Field()
  @Column({ type: "float" })
  @IsPositive()
  energy: number;

  @OneToMany(() => Entry, e => e.unit)
  entries: Entry[];

  @Field(() => ID)
  @Column()
  createdById: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => ID)
  @Column()
  updatedById: number;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;
}
