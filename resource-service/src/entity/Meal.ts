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
  OneToMany,
} from "typeorm";
import { Entry } from "./Entry";

export class Meal extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Entry])
  @ManyToOne(() => Entry, e => e.meal)
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
