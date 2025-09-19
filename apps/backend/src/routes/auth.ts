import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserRole } from '../generated/prisma/index.js';
import getPrisma from '../lib/prisma.js';

const router: Router = Router();

// NOTE: This endpoin will be admin-only protected later
router.post('/register', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma(); // Create fresh client

    const { email, password, role = UserRole.USER } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as UserRole,
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    // Return respond
    return res.status(201).json({ user });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
