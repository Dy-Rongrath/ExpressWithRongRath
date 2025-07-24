// src/types/express/index.d.ts

// This defines the shape of the data we store in the JWT
export interface JwtPayload {
  id: string;
  email: string;
  roles: string[];
  organizationId?: string;
}

// This tells TypeScript to add our custom 'user' property to the Request object
declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
