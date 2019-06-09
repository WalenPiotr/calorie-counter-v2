import { plainToClass } from "class-transformer";
import { Min, validate } from "class-validator";
import { ArgumentValidationError } from "type-graphql";
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

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum Status {
  OK = "OK",
  BANNED = "BANNED",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  role: Role;

  @Column()
  email: string;

  @Column()
  @Min(3)
  displayName: string;

  @Column({ unique: true, select: false })
  externalId: string;

  @Column("text")
  provider: Provider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("text")
  status: Status;

  static async validate(obj: any) {
    const clzObj = plainToClass(User, obj);
    const errors = await validate(clzObj);
    if (errors.length > 0) {
      throw new ArgumentValidationError(errors);
    }
  }
}
