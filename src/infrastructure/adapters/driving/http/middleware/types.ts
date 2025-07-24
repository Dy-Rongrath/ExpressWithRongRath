import { Request } from "express";
import type { User as AppUser } from "../../../../../core/domain/user";

export interface AuthenticatedRequest extends Request {
  user?: AppUser & Express.User;
}
