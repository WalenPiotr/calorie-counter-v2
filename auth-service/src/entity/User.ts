import { Min } from "class-validator";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum Provider {
  GOOGLE = "GOOGLE",
}
registerEnumType(Provider, {
  name: "Provider",
});

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
registerEnumType(Role, {
  name: "Role",
});

export enum Status {
  OK = "OK",
  BANNED = "BANNED",
}
registerEnumType(Status, {
  name: "Status",
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Role)
  @Column("text")
  role: Role;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  @Min(3)
  displayName: string;

  @Column({ unique: true, select: false })
  externalId: string;

  @Field(() => Provider)
  @Column("text")
  provider: Provider;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Status)
  @Column("text")
  status: Status;
}
