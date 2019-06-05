import Express from "express";
import { Role } from "../entity/User";

export const isAuthenticated = (roles?: Role[]) => (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) => {
  if (req.session) {
    const { user } = req.session.passport;
    if (!roles && user) {
      return next();
    }
    if (roles && user && roles.indexOf(user.role) >= 0) {
      return next();
    }
  }
  return res.redirect("/login");
};
