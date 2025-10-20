import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined = undefined;

export const getPrisma = (): PrismaClient => {
  prisma ??= new PrismaClient();

  return prisma;
};

export default getPrisma;
