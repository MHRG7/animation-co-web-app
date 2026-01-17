import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import logger from '../lib/logger.js';

export function requireRole(allowedRoles: UserRole[]) {
  if (allowedRoles.length === 0) {
    throw new Error(
      'requireRole must be called with at least one allowed role'
    );
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
      logger.warn('Authorization failed', {
        userId: user.userId,
        userRole: user.role,
        requiredRoles: allowedRoles,
      });
      return;
    }
  };
}
