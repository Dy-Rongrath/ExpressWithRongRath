// src/infrastructure/adapters/driving/http/middleware/auth.middleware.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "./types";

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required." });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Server configuration error: JWT secret is not defined.");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,
      organizationId: decoded.organizationId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
