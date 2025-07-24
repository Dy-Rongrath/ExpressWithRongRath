import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../../../../core/use-cases/register-user.use-case";
import { MongoUserRepository } from "../../../driven/persistence/mongo-user.repository";

// Instantiate repository and use case
const userRepository = new MongoUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);

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
