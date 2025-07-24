// src/infrastructure/adapters/driving/http/middleware/rbac.middleware.ts
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./types";

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.roles) {
      // This should technically be caught by authMiddleware first
      return res.status(401).json({ message: "Authentication required." });
    }

    const hasRole = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: "Forbidden: You do not have the required permissions.",
      });
    }

    next();
  };
};
