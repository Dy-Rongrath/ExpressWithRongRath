// src/infrastructure/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { MongoUserRepository } from "../adapters/driven/persistence/mongo-user.repository";
import { User } from "../../core/domain/user";

export const configurePassport = () => {
  const userRepository = new MongoUserRepository();

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/api/v1/users/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Check if a user with this Google email already exists
          const email = profile.emails?.[0].value;
          if (!email) {
            return done(
              new Error("Email not found in Google profile."),
              undefined
            );
          }

          let user = await userRepository.findByEmail(email);

          // 2. If user exists, we're done.
          if (user) {
            return done(null, user);
          }

          // 3. If user doesn't exist, create a new user and organization (Just-in-Time Provisioning)
          const newUserDetails = {
            name: profile.displayName,
            email,
            // For social logins, we don't have a password. We can store a placeholder or leave it empty.
            // A good practice is to make passwordHash optional in the domain/schema for this case.
            // For now, we'll create a random, unusable hash.
            passwordHash: Math.random().toString(36).slice(-8),
            roles: ["Org Admin"] as (
              | "Org Admin"
              | "Project Manager"
              | "Member"
            )[],
            organizationId: "", // Will be set by createWithOrganization
          };

          // The organization name can be derived, e.g., "John Doe's Organization"
          const organizationName = `${profile.displayName}'s Organization`;

          user = await userRepository.createWithOrganization(
            newUserDetails,
            organizationName
          );

          return done(null, user);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
};
