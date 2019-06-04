import { plainToClass } from "class-transformer";
import { IsPositive, MaxLength, MinLength, validate } from "class-validator";
import { ArgumentValidationError, Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";

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
  @Column()
  @IsPositive()
  energy: number;

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

  static async validate(obj: Unit) {
    const errors = await validate(obj);
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
  }

  static fromObject(obj: any) {
    return plainToClass(Unit, obj);
  }
}
