import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { disconnectDatabase } from '../helpers/testDb.js';
import {
  createAdminAndGetToken,
  testPassword,
  uniqueEmail,
} from '../helpers/testHelpers.js';

afterAll(async () => {
  await disconnectDatabase();
});

describe('Authorization Middleware', () => {
  describe('POST /api/auth/register (admin-only)', () => {
    it('should return 401 when no token is provided', async () => {
      const email = uniqueEmail('authorize-no-token');

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email, password: testPassword() });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 when user is not ADMIN', async () => {
      const adminToken = await createAdminAndGetToken(app);

      // Admin creates a regular user
      const regularEmail = uniqueEmail('regular-user');

      const createUserResponse = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: regularEmail,
          password: 'Test1234!',
          role: 'USER',
        });

      // Verify user was created successfully
      expect(createUserResponse.status).toBe(201);

      // Login as regular user
      const userLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: regularEmail,
          password: 'Test1234!',
        });

      expect(userLoginResponse.status).toBe(200);

      const userToken = userLoginResponse.body.accessToken as string;

      // Regular user tries to create another user (should fail)
      const anotherEmail = uniqueEmail('another');
      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          email: anotherEmail,
          password: 'Test1234!',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden');
    });
  });
});
