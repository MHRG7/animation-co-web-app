import { UserRole } from '@prisma/client';

/**
 * JWT token payload structure
 * This is backend-only frontend never decodes tokens
 * Uses Prisma's UserRole since it's created from database data
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}
