import { exec } from 'child_process';
import { promisify } from 'util';
import getPrisma from '../../src/lib/prisma.js';

const execAsync = promisify(exec);

/**
 * Reset test database to clean state
 * Runs Prisma migrations and clears all data
 */
export async function resetTestDatabase(): Promise<void> {
  // Set test database URL
  process.env['DATABASE_URL'] = process.env['DATABASE_URL_TEST'];

  // Push Prisma schema to test database (creates tables if needed)
  await execAsync('pnpm prisma db push --skip-generate --force-reset');

  // Clear all data (redundant with force-reset, but explicit)
  const prisma = getPrisma();
  await prisma.user.deleteMany({});
}

/**
 * Disconnect Prisma after all tests
 */
export async function disconnectDatabase(): Promise<void> {
  const prisma = getPrisma();
  await prisma.$disconnect();
}
