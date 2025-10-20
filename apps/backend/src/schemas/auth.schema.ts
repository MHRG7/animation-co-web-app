import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  email: z.email({ message: 'Invalid email format' }).toLowerCase().trim(),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  role: z.enum(UserRole).optional().default(UserRole.USER),
});

export type RegisterInput = z.infer<typeof registerSchema>;
