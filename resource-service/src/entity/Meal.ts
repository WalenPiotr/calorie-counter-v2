import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ArgumentValidationError, Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Entry } from "./Entry";
import { RecursivePartial } from "../types/RecursivePartial";

@ObjectType()
@Entity()
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

  static async validate(obj: RecursivePartial<Meal>) {
    const errors = await validate(plainToClass(Meal, obj));
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
  }
}
