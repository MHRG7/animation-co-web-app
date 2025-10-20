import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests allowed
  duration: 60, // Per 60 seconds
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
