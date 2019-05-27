import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Unit } from "./Unit";
import { Entry } from "./Entry";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
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

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Field(() => ID)
  @Column()
  updatedById: number;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
