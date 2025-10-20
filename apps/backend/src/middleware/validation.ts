import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate and transform req.body (Express 5 handles async errors)
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Modern error formating
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      res.status(400).json({ error: 'Invalid request data' });
    }
  };
};
