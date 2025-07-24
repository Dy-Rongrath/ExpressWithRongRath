import { IUserRepository } from "../../ports/user.repository";
import { IPasswordService } from "../../ports/password.service";
import { ITokenService } from "../../ports/token.service";

/**
 * The use case for logging in a user. It coordinates finding a user,
 * verifying their password, and generating an authentication token.
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
   */
  async execute(email: string, password: string): Promise<string> {
    // 1. Find the user by their email address
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      throw new Error("Invalid credentials");
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordMatch = await this.passwordService.compare(
      password,
      existingUser.passwordHash
    );

    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    // 3. If credentials are valid, generate a JWT
    return this.tokenService.generateToken(existingUser);
  }
}
