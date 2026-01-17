import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation.js';
import { isProduction } from '../config/env.js';
import {
  registerSchema,
  loginSchema,
  type RegisterData,
  type LoginRequest,
  type RegisterResponse,
  type LoginResponse,
} from '@animation-co/shared-types';
import logger from '../lib/logger.js';
import {
  login,
  refreshAccessToken,
  register,
  logout,
} from '../services/authService.js';
import { toApiUser } from '../utils/typeConverters.js';
import { authenticateJWT } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';
import { UserRole } from '@prisma/client';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const router: Router = Router();

// POST / auth/register
router.post(
  '/register',
  authenticateJWT,
  requireRole([UserRole.ADMIN]),
  validate(registerSchema),
  async (req: Request<unknown, unknown, RegisterData>, res: Response) => {
    try {
      const user = await register(req.body);

      // Convert service result (Prisma types) to API response (shared types)
      const response: RegisterResponse = {
        user: toApiUser(user),
      };

      return res.status(201).json(response);
    } catch (error) {
      logger.error('Registration error:', { error });

      // Prisma unique constraint violation (duplicate email)
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
  async (req: Request<unknown, unknown, LoginRequest>, res: Response) => {
    try {
      const result = await login(req.body);

      // Convert Prisma types to API types
      const response: LoginResponse = {
        user: toApiUser(result.user),
        accessToken: result.accessToken,
      };

      return res
        .status(200)
        .cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS)
        .json(response);
    } catch (error) {
      logger.error('Login error:', {
        message: error instanceof Error ? error.message : String(error),
      });

      // Security: Always return 401 for login failures (vague error)
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }
);

// POST /auth/refresh - Get new access token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken, accessToken } = await refreshAccessToken(
      req.cookies['refreshToken'] as string
    );

    return res
      .status(200)
      .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
      .json({ accessToken });
  } catch (error) {
    logger.error('Refresh token error:', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// POST /auth/logout - Revoke refresh token
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await logout(req.cookies['refreshToken'] as string);

    // 204 = Success, no data return
    return res
      .status(204)
      .clearCookie('refreshToken', { path: '/api/auth' })
      .send();
  } catch (error) {
    logger.error('Logout error:', { error });
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /auth/me - Get current user info (protected route)
router.get('/me', authenticateJWT, (req: Request, res: Response) => {
  // User info already attached by middleware
  return res.status(200).json({ user: req.user });
});

export default router;
