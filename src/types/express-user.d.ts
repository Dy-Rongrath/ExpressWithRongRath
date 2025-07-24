import type { User as AppUser } from "../core/domain/user";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
