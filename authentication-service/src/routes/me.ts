import Express from "express";
import { User } from "../entity/User";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Express.Router();

router.get("/me", isAuthenticated(), async (req, res) => {
  const { user } = req.session!.passport;
  return res.json(user);
});

router.patch("/me", isAuthenticated(), async (req, res) => {
  const { displayName } = req.body;
  const { id } = req.session!.passport.user;
  await User.update({ id }, { displayName });
  res.json(true);
});

export default router;
