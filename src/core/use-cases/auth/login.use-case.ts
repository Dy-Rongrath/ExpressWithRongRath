import { IUserRepository } from "../../ports/user.repository";
import { IPasswordService } from "../../ports/password.service";
import { ITokenService } from "../../ports/token.service";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await this.passwordService.compare(
      password,
      user.passwordHash
    );
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    return this.tokenService.generateToken(user);
  }
}
