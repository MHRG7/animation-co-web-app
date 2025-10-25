import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

const rateLimiter = new RateLimiterMemory({
  points: env.RATE_LIMIT_MAX, // Number of requests allowed
  duration: env.RATE_LIMIT_WINDOW_MS / 1000, // Per 60 seconds
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get client IP address
    const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';

    // Try to consume 1 point
    await rateLimiter.consume(key);

    // If successful, allow request to proceed
    next();
  } catch {
    // Rate limit exceeded
    res
      .status(429)
      .json({ error: 'Too many requests, please try again later.' });
  }
};
