import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

const execAsync = promisify(exec);

export async function setup(): Promise<void> {
  // Load .env file FIRST
  config();

  // Set test database globally
  process.env['DATABASE_URL'] = process.env['DATABASE_URL_TEST'];

  // Push schema once for entire test suite
  await execAsync('pnpm prisma db push --skip-generate');

  // Clear any leftover data from previous test runs
  const prisma = new PrismaClient();
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();

  console.log('✓ Test database initialized');
}

export function teardown(): void {
  console.log('✓ Test suite complete');
}
