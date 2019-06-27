import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { Entry } from "./Entry";
import { MinLength } from "class-validator";

@ObjectType()
@Entity()
@Unique(["createdById", "date", "name"])
export class Meal extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(1)
  @Field()
  name: string;

  @OneToMany(() => Entry, e => e.meal)
  entries: Entry[];

  @Field(() => Date)
  @Column()
  date: Date;

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
