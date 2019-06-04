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

  static fromObject(obj: any) {
    return plainToClass(Meal, obj);
  }
}
