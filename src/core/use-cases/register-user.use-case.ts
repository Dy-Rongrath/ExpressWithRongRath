import { IUserRepository } from "../ports/user.repository";
import { User } from "../domain/user";
import bcrypt from "bcryptjs";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: any): Promise<User> {
    const { name, email, password, organizationName } = input;

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create user and organization
    const newUser = await this.userRepository.createWithOrganization(
      {
        name,
        email,
        passwordHash,
        organizationId: "", // Temp value, will be set by the repo
        roles: ["Org Admin"], // First user is always an admin
      },
      organizationName
    );

    return newUser;
  }
}
