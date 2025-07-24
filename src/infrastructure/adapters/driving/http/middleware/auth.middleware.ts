import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Fail-fast check to ensure the secret is loaded.
if (!JWT_SECRET) {
  throw new Error(
    "FATAL ERROR: JWT_SECRET is not defined in environment variables."
  );
}

/**
 * Middleware to verify the JWT from the Authorization header.
 * If valid, it attaches the decoded payload to the `req.user` property.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and cast the payload to our custom type
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Attach the user payload to the request for downstream use
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token." });
  }
};
