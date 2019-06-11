import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ArgumentValidationError, Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Meal } from "./Meal";
import { Product } from "./Product";
import { RecursivePartial } from "../types/RecursivePartial";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Product)
  @ManyToOne(() => Product, p => p.entries)
  @JoinTable()
  product: Product;

  @Field()
  @Column({ type: "float" })
  quantity: number;

  @Field(() => Meal)
  @OneToMany(() => Meal, m => m.entries)
  meal: Meal;

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

  static async validate(obj: RecursivePartial<Entry>) {
    const errors = await validate(plainToClass(Entry, obj));
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
  }
}
