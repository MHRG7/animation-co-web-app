/**
 * User role enum - shared across frontend and backend
 * Must match Prisma schema enum values
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

/**
 * User entity as returned by API endpoints
 * This is Not Prisma model - it's the public API representation
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string; // ISO 8601 data string
}

/**
 * Standard API error response shape
 * Returned by all endpoints on error
 */
export interface ApiError {
  message: string;
  errors?: ValidationError[];
}

/**
 * Individual validation error (from zod)
 */
export interface ValidationError {
  path: string[];
  message: string;
}
