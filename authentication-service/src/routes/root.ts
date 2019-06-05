import Express from "express";
import passport from "passport";

const router = Express.Router();

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.send("successfully log out!");
    });
  }
});
router.get("/isalive", (_, res) => {
  res.send("Auth service is alive");
});

export default router;
