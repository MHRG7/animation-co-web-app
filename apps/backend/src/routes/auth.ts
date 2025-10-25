import { Router, Request, Response } from 'express';
import { env } from '../config/env.js';
import bcrypt from 'bcryptjs';
import getPrisma from '../lib/prisma.js';
import { validate } from '../middleware/validation.js';
import { registerSchema, RegisterInput } from '../schemas/auth.schema.js';

const router: Router = Router();

// NOTE: This endpoin will be admin-only protected later
router.post(
  '/register',
  validate(registerSchema),
  async (req: Request<unknown, unknown, RegisterInput>, res: Response) => {
    try {
      const prisma = getPrisma();

      const { email, password, role } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
        select: { id: true, email: true, role: true, createdAt: true },
      });

      // Return respond
      return res.status(201).json({ user });
    } catch (error) {
      console.error('Registration error:', error);

      // Modern type guard
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
