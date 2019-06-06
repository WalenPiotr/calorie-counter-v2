import {
  OAuth2Strategy as GoogleStrategy,
  Profile,
} from "passport-google-oauth";
import { User, Provider, Role, Status } from "../entity/User";
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URL) {
  throw new Error("Invalid google OAuth config");
}
export const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_REDIRECT_URL,
  },
  async function(_, __, profile: Profile, done) {
    if (profile && profile.emails) {
      const count = await User.count();

      const found = await User.findOne({
        externalId: profile.id,
        provider: Provider.GOOGLE,
      });
      if (found) {
        return done(null, found);
      }
      const created = await User.create({
        email: profile.emails[0].value,
        displayName: profile.displayName,
        externalId: profile.id,
        provider: Provider.GOOGLE,
        role: count === 0 ? Role.ADMIN : Role.USER,
        status: Status.OK,
      }).save();
      return done(null, created);
    }
    return done(new Error("No profile provided"));
  },
);
