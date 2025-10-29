import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation.js';
import {
  registerSchema,
  RegisterInput,
  loginSchema,
  LoginInput,
} from '../schemas/auth.schema.js';
import logger from '../lib/logger.js';
import { login, register } from '../services/authService.js';

const router: Router = Router();

// NOTE: This endpoin will be admin-only protected later
router.post(
  '/register',
  validate(registerSchema),
  async (req: Request<unknown, unknown, RegisterInput>, res: Response) => {
    try {
      const user = await register(req.body);
      return res.status(201).json({ user });
    } catch (error) {
      logger.error('Registration error:', { error });

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

router.post(
  '/login',
  validate(loginSchema),
  async (req: Request<unknown, unknown, LoginInput>, res: Response) => {
    try {
      const result = await login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Login error:', { error });

      // Security: Always return 401 for login failures (vague error)
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }
);

export default router;
