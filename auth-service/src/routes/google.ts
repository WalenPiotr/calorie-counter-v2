import Express from "express";
import passport from "passport";

const router = Express.Router();

const { SUCCESS_REDIRECT_URL } = process.env;
if (!SUCCESS_REDIRECT_URL) {
  throw Error("No SUCCESS_REDIRECT_URL env var");
}

router.get(
  "/login",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "select_account",
    session: true,
  }),
);
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  async function(_, res) {
    res.redirect(SUCCESS_REDIRECT_URL);
  },
);

export default router;
