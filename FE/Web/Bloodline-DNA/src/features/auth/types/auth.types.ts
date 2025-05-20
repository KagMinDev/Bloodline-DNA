export interface Login {
  Email: string;
  PasswordHash: string;
}

export interface Register {
  FullName: string;
  Email: string;
  Phone: string;
  PasswordHash: string;
  Role: string;
  Address: string;
}

export type UserRole = "customer" | "staff" | "manager" | "admin";
