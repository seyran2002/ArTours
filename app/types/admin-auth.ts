export interface LoginForm {
  email: string
  password: string
}

export interface LoginError {
  message: string
}

export interface LoginResponse {
  token: string
  // Extendable with other fields like user details, expiresAt, etc.
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  role: "ADMIN";
}
