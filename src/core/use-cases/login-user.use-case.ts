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

    // 2. Compare the provided password with the stimport { IUserRepository } from "../ports/user.repository";
import { IPasswordService } from "../ports/password.service";
import { ITokenService } from "../ports/token.service";
import { User } from "../domain/user";

/**
 * The use case for logging in a user.
 * It coordinates the process of finding a user, verifying their password,
 * and generating an authentication token.
 */
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  /**
   * Executes the login process.
   * @param email - The user's email address.
   * @param password - The user's plain-text password.
   * @returns A promise that resolves to a JWT if credentials are valid.
   * @throws An error if the user is not found or the password is a mismatch.
   */
  async execute(email: string, password: string): Promise<string> {
    // 1. Find the user by their email address
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      throw new Error("Invalid credentials");
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordMatch = await this.passwordService.comparePasswords(
      password,
      existingUser.passwordHash
    );

    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    // 3. If credentials are valid, generate a JWT
    const token = this.tokenService.generateToken(existingUser);

    return token;
  }
}ored hash
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
