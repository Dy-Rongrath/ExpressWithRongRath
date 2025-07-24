import { User } from "../domain/user";

export interface IUserRepository {
  createWithOrganization(
    userDetails: Omit<User, "id" | "createdAt">,
    orgName: string
  ): Promise<User>;
  findOrCreate(userDetails: {
    email: string;
    name: string;
    googleId: string;
  }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
