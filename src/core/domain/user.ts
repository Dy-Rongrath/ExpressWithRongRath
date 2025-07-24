export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // We'll store a hash, not the plain password
  organizationId: string;
  roles: ("Org Admin" | "Project Manager" | "Member")[];
  createdAt: Date;
}
