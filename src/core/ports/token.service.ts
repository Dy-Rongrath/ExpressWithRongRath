import { User } from "../domain/user";

export interface ITokenService {
  generateToken(user: User): string;
}
