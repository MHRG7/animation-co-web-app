import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { resetTestDatabase, disconnectDatabase } from '../helpers/testDb.js';

//Type definitions for API responses
interface RegisterSuccessResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: { field: string; message: string }[];
}

// Run once before all tests in this file - schema setup (slow)
beforeAll(async () => {
  await resetTestDatabase();
}, 30000);

// Run before each test - just clear data (fast)
beforeEach(async () => {
  await resetTestDatabase();
});

// Run once after all tests complete
afterAll(async () => {
  await disconnectDatabase();
});

describe('POST /auth/register', () => {
  it('should successfully register a new user with valid data', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'test@example.com',
      password: 'Test1234!',
      role: 'USER',
    });

    // Assert response status
    expect(response.status).toBe(201);

    const body = response.body as RegisterSuccessResponse;
    // Assert response body structure
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user.email).toBe('test@example.com');
    expect(body.user.role).toBe('USER');

    // Assert password is NOT returned
    expect(body.user).not.toHaveProperty('password');
  });

  it('should reject duplicate email with 409 status', async () => {
    // First registration
    await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'Test1234!',
    });

    // Second registration with same email
    const response = await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'DifferentPassword1!',
    });

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(409);
    expect(body.error).toBe('Email already exists');
  });

  it('should validate input and reject invalid data', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'not-an-email',
      password: 'weak',
    });

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(400);
    expect(body.error).toBe('Validation failed');
    expect(body.details).toBeInstanceOf(Array);
  });
});
