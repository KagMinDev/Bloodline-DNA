export interface Login {
  email: string;
  password: string;
}

export interface Register {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  address: string;
}

export type UserRole = "customer" | "staff" | "manager" | "admin";
