import Express from "express";
import { User } from "../entity/User";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Express.Router();

router.get("/", isAuthenticated(), async (req, res) => {
  try {
    const { user } = req.session!.passport;
    return res.json(user);
  } catch (e) {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

router.patch("/", isAuthenticated(), async (req, res) => {
  const { displayName } = req.body;
  const { id } = req.session!.passport.user;
  await User.update({ id }, { displayName });
  res.json(true);
});

export default router;
