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
  displayName: string;

  @Column({ unique: true })
  externalId: string;

  @Column("text")
  provider: Provider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("text")
  status: Status;
}
