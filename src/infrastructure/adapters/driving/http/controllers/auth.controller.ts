import { Request, Response } from "express";
import passport from "passport";
import { User } from "../../../../../core/domain/user";

// Core Use Cases
import { RegisterUserUseCase } from "../../../../../core/use-cases/auth/register-user.use-case";
import { LoginUseCase } from "../../../../../core/use-cases/auth/login.use-case";

// Driven Adapters
import { MongoUserRepository } from "../../../driven/persistence/mongo-user.repository";
import { BcryptPasswordService } from "../../../driven/services/bcrypt-password.service";
import { JwtTokenService } from "../../../driven/services/jwt-token.service";

// Instantiation Block
const userRepository = new MongoUserRepository();
const passwordService = new BcryptPasswordService();
const tokenService = new JwtTokenService();

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordService
);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordService,
  tokenService
);

// Controller Functions
export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUserUseCase.execute(req.body);
    const { passwordHash, ...userResponse } = user as any;
    res.status(201).json(userResponse);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUseCase.execute(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const googleCallback = (req: Request, res: Response) => {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: "/login-failed" },
    (err: any, user: User) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ message: "Google authentication failed." });
      }
      const token = tokenService.generateToken(user);
      return res.status(200).json({ token });
    }
  )(req, res);
};
