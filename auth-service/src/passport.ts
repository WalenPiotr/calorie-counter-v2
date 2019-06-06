import passport from "passport";
import { googleStrategy } from "./strategy/google";

passport.use(googleStrategy);
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

export default passport.initialize();
