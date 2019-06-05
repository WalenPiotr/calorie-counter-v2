import Express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Role, User, Status } from "../entity/User";
import { removeUndefined } from "../helpers";

const router = Express.Router();
router.get("/users", isAuthenticated([Role.ADMIN]), async (req, res) => {
  const email = req.query.email;
  const displayName = req.query.name;
  const role = req.query.role;
  const provider = req.query.provider;
  const status = req.query.status;
  const queryObj = {
    email,
    displayName,
    role,
    provider,
    status,
  };
  const users = await User.find(removeUndefined(queryObj));
  res.json(users);
});

router.get("/users/:id", isAuthenticated([Role.ADMIN]), async (req, res) => {
  const { id } = req.params;
  const users = await User.findOne({ id });
  res.json(users);
});

router.patch("/users/:id/", isAuthenticated([Role.ADMIN]), async (req, res) => {
  const { id } = req.params;
  const { status, displayName, role } = req.body;
  if (status === Status.OK || status === Status.BANNED) {
    await User.update({ id }, { status, displayName, role });
  }
  res.json(true);
});

export default router;
