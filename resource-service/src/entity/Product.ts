import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Entry } from "./Entry";
import { Unit } from "./Unit";
import { Report } from "./Report";

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

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => ID)
  @Column()
  updatedById: number;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Report])
  @ManyToOne(() => Report, r => r.product)
  reports: Report[];
}
