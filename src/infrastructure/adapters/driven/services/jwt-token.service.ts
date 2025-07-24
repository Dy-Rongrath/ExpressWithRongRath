// src/infrastructure/driven/services/jwt-token.service.ts

import jwt from "jsonwebtoken";
import { ITokenService } from "../../../../core/ports/token.service";
import { User } from "../../../../core/domain/user";

// Ensure you have a JWT_SECRET in your .env file
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}

export class JwtTokenService implements ITokenService {
  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      organizationId: user.organizationId,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
  }
}
