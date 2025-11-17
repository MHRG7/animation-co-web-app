// User role Enum
export enum Role {
  'ADMIN',
  'EDITOR',
  'USER',
}

// User data returned from backend
export interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

// Login request body
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response from backend
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Register request body
export interface RegisterRequest {
  email: string;
  password: string;
  role?: Role;
}

// Register response from backend
export interface RegisterResponse {
  user: User;
}

// Error response from backend
export interface ApiError {
  message: string;
  errors?: {
    path: string[];
    message: string;
  }[];
}
