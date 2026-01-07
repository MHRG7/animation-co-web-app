import { z } from 'zod';
import { UserRole, User } from './common.js';

// ============================================================================
// Zod Validation Schemas (used by both frontend and backend)
// ============================================================================

/**
 * Register request schema
 * Used for client-side validation (before submit) and server-side validation
 */
export const registerSchema = z.object({
  email: z.email({ error: 'Invalid email format' }).toLowerCase().trim(),
  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  role: z.enum(UserRole).optional().default(UserRole.USER),
});

/**
 * Login request schema
 * Note: Password validation is minimal (just required)
 * We don't want to reveal password requirements during login (security)
 */
export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email format' }).toLowerCase().trim(),
  password: z
    .string({ error: 'Password is required' })
    .min(1, 'Password is required'),
});

// ============================================================================
// TypeScript Types (infered from Zod schemas - DRY principle)
// ============================================================================

// Input types(what client send - before validation)
export type RegisterRequest = z.input<typeof registerSchema>;
export type LoginRequest = z.input<typeof loginSchema>;

// Output types (what services recive - after validation & defaults)
export type RegisterData = z.output<typeof registerSchema>;

// ============================================================================
// API Response Types (not validated by Zod, just TypeScript interfaces)
// ============================================================================

/**
 * Response from POST /api/auth/register
 */
export interface RegisterResponse {
  user: User;
}

/**
 * Response from POST /api/auth/login
 */
export interface LoginResponse {
  user: User;
  accessToken: string;
}

/**
 * Response from POST /api/auth/refresh
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Response from GET /auth/me
 */
export interface MeResponse {
  user: User;
}
