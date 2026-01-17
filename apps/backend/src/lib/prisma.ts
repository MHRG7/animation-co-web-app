import { PrismaClient } from '@prisma/client';
import { isTest } from '../config/env.js';

let prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  // Create new client if needed
  prisma ??= new PrismaClient({
    log: isTest ? [] : ['query', 'error', 'warn'],
  });

  return prisma;
}

// Test usage - forces reconnect with await
export async function resetPrisma(): Promise<PrismaClient> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined;
  }

  prisma = new PrismaClient({
    log: isTest ? [] : ['error', 'warn'],
  });

  // Force connection to establish before returning
  await prisma.$connect();

  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined;
  }
}

export default getPrisma;
