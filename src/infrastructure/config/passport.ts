import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { MongoUserRepository } from "../adapters/driven/persistence/mongo-user.repository";

const userRepository = new MongoUserRepository();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(
            new Error("Email not found in Google profile."),
            undefined
          );
        }

        const user = await userRepository.findOrCreate({
          googleId: profile.id,
          email: email,
          name: profile.displayName,
        });

        return done(null, user); // User is passed to the route handler
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
