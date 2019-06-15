import { plainToClass } from "class-transformer";
import { MaxLength, MinLength, validate } from "class-validator";
import { ArgumentValidationError, Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Entry } from "./Entry";
import { Report } from "./Report";
import { Unit } from "./Unit";
import { RecursivePartial } from "../types/RecursivePartial";

@ObjectType()
@Entity()
@Unique(["name"])
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @Field(() => [Unit])
  @OneToMany(() => Unit, u => u.product)
  units: Unit[];

  @Field(() => [Entry])
  @OneToMany(() => Entry, e => e.product)
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

  @Field(() => [Report], { nullable: true })
  @OneToMany(() => Report, r => r.product)
  reports: Report[];
}
