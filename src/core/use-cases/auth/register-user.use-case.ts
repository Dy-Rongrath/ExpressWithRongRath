import { IUserRepository } from "../../ports/user.repository";
import { IPasswordService } from "../../ports/password.service";
import { User } from "../../domain/user";

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(input: any): Promise<User> {
    const { name, email, password, organizationName } = input;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const passwordHash = await this.passwordService.hash(password);

    const newUser = await this.userRepository.createWithOrganization(
      { name, email, passwordHash, organizationId: "", roles: ["Org Admin"] },
      organizationName
    );

    return newUser;
  }
}
