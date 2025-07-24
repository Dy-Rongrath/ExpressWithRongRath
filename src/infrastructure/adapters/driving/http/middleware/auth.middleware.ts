// src/infrastructure/adapters/driving/http/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../../../../types/express"; // Import our custom payload type

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and attach its payload to the request object
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // The user property is now correctly typed
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
