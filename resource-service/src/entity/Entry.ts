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

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Product])
  @ManyToOne(() => Product, p => p.entries)
  @JoinTable()
  product: Product;

  @Field()
  @Column()
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

  static async validate(obj: Entry) {
    const errors = await validate(obj);
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
  }

  static fromObject(obj: any) {
    return plainToClass(Entry, obj);
  }
}
