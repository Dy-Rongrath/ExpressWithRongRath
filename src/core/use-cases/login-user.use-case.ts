// src/core/use-cases/user/login-user.use-case.ts
import { IUserRepository } from "../ports/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: any): Promise<{ token: string }> {
    const { email, password } = input;

    // 1. Find the user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // 3. Generate a JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined.");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles, organizationId: user.organizationId },
      jwtSecret,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return { token };
  }
}
