import getPrisma, { disconnectPrisma } from '../../src/lib/prisma.js';

/**
 * Clear data between tests
 * Call this in beforeEach()
 */
export async function clearTestDatabase(): Promise<void> {
  const prisma = getPrisma();
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
}

/**
 * Disconnect after all tests
 * Call this in afterAll()
 */
export async function disconnectDatabase(): Promise<void> {
  await disconnectPrisma();
}
