import { AuthChecker } from "type-graphql";
import { ContextType } from "../types/ContextType";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum Status {
  OK = "OK",
  BANNED = "BANNED",
}

export const authChecker: AuthChecker<ContextType> = ({ context }, roles) => {
  const { session } = context.req;
  if (roles.length === 0) {
    return (
      session &&
      session.passport &&
      session.passport.user &&
      session.passport.user.status === Status.OK
    );
  } else {
    return (
      session &&
      session.passport &&
      session.passport.user &&
      roles.indexOf(session.passport.user.role) >= 0 &&
      session.passport.user.status === Status.OK
    );
  }
};
