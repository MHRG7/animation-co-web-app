import { z } from 'zod';

/**
 * Environment variable validation schema
 * Ensures all required config is present and valid on server startup
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),

  // Database
  DATABASE_URL: z.url(),
  DATABASE_URL_TEST: z.url().optional(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Password Hashing
  BCRYPT_ROUNDS: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(8).max(15)),

  // CORS
  FRONTEND_URL: z.url(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive()),
  RATE_LIMIT_MAX: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive()),
});

/**
 * Validate environment configuration
 * Throws error on server startup if validation fails
 */
function validateEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    result.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error('Environment validation failed');
  }

  return result.data;
}

/**
 * Typed environment configuration
 * Use this instead of process.env throughout the app
 */
export const env = validateEnv();

/**
 * Type-safe helper to check if we're in a specific environment
 */
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
