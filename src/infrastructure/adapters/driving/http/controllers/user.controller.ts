import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../../../../core/use-cases/register-user.use-case";
import { MongoUserRepository } from "../../../driven/persistence/mongo-user.repository";
import { LoginUserUseCase } from "../../../../../core/use-cases/login-user.use-case";
import { AuthenticatedRequest } from "../middleware/types";

// Instantiate repository and use cases
const userRepository = new MongoUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository); // <-- Add this line

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await registerUserUseCase.execute(req.body);
    // Don't send the password hash back to the client
    const { passwordHash, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { token } = await loginUserUseCase.execute(req.body); // <-- Use the instance
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  // The user ID is available from the authMiddleware
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found in token." });
  }

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const { passwordHash, ...userResponse } = user;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
