import Express from "express";
import { Role } from "../entity/User";

export const isAuthenticated = (roles?: Role[]) => (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) => {
  try {
    const { user } = req.session!.passport;
    if (!roles && user) {
      return next();
    }
    if (roles && user && roles.indexOf(user.role) >= 0) {
      return next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
};
