import { User } from "../domain/user";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findOrCreate(userDetails: {
    email: string;
    name: string;
    googleId: string;
  }): Promise<User>;

  createWithOrganization(
    userDetails: Omit<User, "id" | "createdAt">,
    orgName: string
  ): Promise<User>;
}
