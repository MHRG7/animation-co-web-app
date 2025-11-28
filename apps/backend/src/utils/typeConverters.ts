import { UserRole as PrismaUserRole } from '@prisma/client';
import { User, UserRole } from '@animation-co/shared-types';

/**
 * Convert Prisma User to API User type
 *
 * This is the only place where we handle Prisma -> API type conversion
 * If you add a new User field (like "name"), update it here only
 *
 * Why we need this:
 * - Prisma's UserRole enum is nominally different from shared UserRole
 * - Date objects need conversion to ISO strings for JSON
 * - Keep routes clean and DRY
 */
export function toApiUser(prismaUser: {
  id: string;
  email: string;
  role: PrismaUserRole;
  isActive: boolean;
  createdAt: Date;
}): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    role: prismaUser.role as unknown as UserRole, // Safe: both are same string values at runtime
    isActive: prismaUser.isActive,
    createdAt: prismaUser.createdAt.toISOString(), // Convert Date → ISO 8601 string
  };
}
