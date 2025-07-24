import bcrypt from "bcryptjs";
import { IPasswordService } from "../../../../core/ports/password.service";

/**
 * A concrete implementation of the IPasswordService using the bcryptjs library.
 */
export class BcryptPasswordService implements IPasswordService {
  /**
   * Hashes a plain-text password.
   * @param password - The plain-text password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // 10 rounds is a good balance of security and performance
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  /**
   * Compares a plain-text password with a hash to see if they match.
   * @param password - The plain-text password provided by the user.
   * @param hash - The stored password hash from the database.
   * @returns A promise that resolves to true if the passwords match, otherwise false.
   */
  async comparePasswords(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
