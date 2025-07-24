import { Request, Response } from "express";
import passport from "passport";

// Core Use Cases
import { RegisterUserUseCase } from "../../../../../core/use-cases/register-user.use-case";
import { LoginUseCase } from "../../../../../core/use-cases/login.use-case";

// Driven Adapters (Services and Repositories)
import { MongoUserRepository } from "../../../driven/persistence/mongo-user.repository";
import { BcryptPasswordService } from "../../../driven/services/bcrypt-password.service";
import { JwtTokenService } from "../../../driven/services/jwt-token.service";

// --- Instantiating Services and Use Cases ---

// Instantiate concrete implementations of our ports
const userRepository = new MongoUserRepository();
const passwordService = new BcryptPasswordService();
const tokenService = new JwtTokenService();

// Inject dependencies into our use cases
const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordService
);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordService,
  tokenService
);

// --- Controller Functions ---

/**
 * Handles the registration of a new user.
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await registerUserUseCase.execute(req.body);
    // Omit the password hash from the response for security
    const { passwordHash, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles user login with email and password.
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUseCase.execute(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

/**
 * Gets the profile of the currently authenticated user.
 */
export const getProfile = (req: Request, res: Response) => {
  // The `req.user` property is attached by the `authMiddleware`
  // and is now globally typed.
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user data found on request." });
  }
  res.status(200).json(req.user);
};

// --- Google OAuth Controller Functions ---

/**
 * Initiates the Google OAuth authentication flow.
 */
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"], // Request access to the user's profile and email
  session: false, // We are using JWTs, not sessions
});

/**
 * Handles the callback from Google after successful authentication.
 */
export const googleAuthCallback = (req: Request, res: Response) => {
  // We use a custom callback to handle the response ourselves
  passport.authenticate(
    "google",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err || !user) {
        // On failure, you could redirect to a frontend failure page
        return res
          .status(401)
          .json({ message: "Google authentication failed." });
      }

      // If the user is found or created, generate a JWT for them
      const token = tokenService.generateToken(user);

      // In a real app, you would likely redirect to your frontend with the token,
      // for example: res.redirect(`https://yourapp.com/auth/success?token=${token}`);
      res.status(200).json({ token });
    }
  )(req, res);
};
