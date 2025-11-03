import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation.js';
import {
  registerSchema,
  RegisterInput,
  loginSchema,
  LoginInput,
  refreshSchema,
  RefreshInput,
  logoutSchema,
  LogoutInput,
} from '../schemas/auth.schema.js';
import logger from '../lib/logger.js';
import {
  login,
  refreshAccessToken,
  register,
  logout,
} from '../services/authService.js';
import { authenticateJWT } from '../middleware/authenticate.js';

const router: Router = Router();

// POST / auth/register
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

// POST /auth/login
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

// POST /auth/refresh - Get new access token
router.post(
  '/refresh',
  validate(refreshSchema),
  async (req: Request<unknown, unknown, RefreshInput>, res: Response) => {
    try {
      const { accessToken } = await refreshAccessToken(req.body.refreshToken);
      return res.status(200).json({ accessToken });
    } catch (error) {
      logger.error('Refresh token error:', { error });
      return res
        .status(401)
        .json({ error: 'Invalid or expired refresh token' });
    }
  }
);

// POST /auth/logout - Revoke refresh token
router.post(
  '/logout',
  validate(logoutSchema),
  async (req: Request<unknown, unknown, LogoutInput>, res: Response) => {
    try {
      await logout(req.body.refreshToken);

      // 204 = Success, no data return
      return res.status(204).send();
    } catch (error) {
      logger.error('Logout error:', { error });
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
);

// GET /auth/me - Get current user info (protected route)
router.get('/me', authenticateJWT, (req: Request, res: Response) => {
  // User info already attached by middleware
  return res.status(200).json({ user: req.user });
});

export default router;
