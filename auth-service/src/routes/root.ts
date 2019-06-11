import Express from "express";

const router = Express.Router();

const { SUCCESS_REDIRECT_URL } = process.env;
if (!SUCCESS_REDIRECT_URL) {
  throw Error("No SUCCESS_REDIRECT_URL env var");
}

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect(SUCCESS_REDIRECT_URL);
    });
  }
});
router.get("/isalive", (_, res) => {
  res.send("Auth service is alive");
});

export default router;
