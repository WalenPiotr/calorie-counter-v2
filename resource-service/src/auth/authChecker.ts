import { AuthChecker } from "type-graphql";
import { ContextType } from "../types/ContextType";

export const ADMIN = "ADMIN";

export const authChecker: AuthChecker<ContextType> = ({ context }, _) => {
  const { session } = context.req;
  if (session && session.passport && session.passport.user) {
    return true;
  }
  return false;
};
