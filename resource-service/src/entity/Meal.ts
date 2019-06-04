import { Field, ID, ObjectType, ArgumentValidationError } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from "typeorm";
import { Entry } from "./Entry";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Product } from "./Product";

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

  static async validate(obj: Meal) {
    const errors = await validate(obj);
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
  }

  static fromObject(obj: Partial<Meal>) {
    return plainToClass(Meal, obj);
  }
}
