import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    // 'user' property is optional
    id: string;
    email: string;
    roles: string[];
  };
}
