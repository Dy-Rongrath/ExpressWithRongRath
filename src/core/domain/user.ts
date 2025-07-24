export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  organizationId: string;
  roles: ("Org Admin" | "Project Manager" | "Member")[];
  createdAt: Date;
}
