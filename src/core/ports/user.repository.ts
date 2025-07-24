import { User } from "../domain/user";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createWithOrganization(
    userDetails: Omit<User, "id" | "createdAt">,
    orgName: string
  ): Promise<User>;
}
