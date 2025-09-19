import { PrismaClient } from '../generated/prisma/index.js';

let prisma: PrismaClient;

export const getPrisma = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export default getPrisma;
