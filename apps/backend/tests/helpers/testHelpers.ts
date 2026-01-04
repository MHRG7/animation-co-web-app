import request from 'supertest';
import type { Express } from 'express';
import getPrisma from '../../src/lib/prisma.js';
import bcrypt from 'bcryptjs';
import { LoginResponse } from '@animation-co/shared-types';

/**
 * Generate unique email for test isolation
 * Each test gets a different email, preventing conflicts
 */
export function uniqueEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp.toString()}-${random}@example.com`;
}

/**
 * Generate unique password
 */
export function testPassword(): string {
  return 'Test1234!';
}

/**
 * Create an admin user and return their access token
 * Useful for tests that need admin authentication
 */
export async function createAdminAndGetToken(app: Express): Promise<string> {
  const prisma = getPrisma();
  const email = uniqueEmail('admin');
  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);

  // Create admin user directly in database
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Login to get token
  const loginResponse = await request(app).post('/api/auth/login').send({
    email,
    password: 'AdminPass123!',
  });

  const body = loginResponse.body as LoginResponse;

  return body.accessToken;
}
