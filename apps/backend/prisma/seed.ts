import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', env.BCRYPT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, // Dont update if exists
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('Created admin user: ', admin.email);

  // Optionally update your existing test user's password
  const testPassword = await bcrypt.hash('Test123!', env.BCRYPT_ROUNDS);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { password: testPassword }, // Reset password
    create: {
      email: 'test@example.com',
      password: testPassword,
      role: UserRole.USER,
      isActive: true,
    },
  });

  console.log('Updated test user: ', testUser.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
