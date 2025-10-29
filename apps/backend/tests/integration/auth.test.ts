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

interface LoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
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

describe('POST /auth/login', () => {
  it('should successfully login with valid credentials', async () => {
    // First register a user
    const registerData = {
      email: 'logintest@example.com',
      password: 'Test1234!',
      role: 'USER',
    };

    await request(app).post('/auth/register').send(registerData);

    // Login with same credentials
    const loginResponse = await request(app).post('/auth/login').send({
      email: registerData.email,
      password: registerData.password,
    });

    // Assert response
    const body = loginResponse.body as LoginSuccessResponse;

    expect(loginResponse.status).toBe(200);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(body).toHaveProperty('user');

    // Assert user object structur
    expect(body.user).toHaveProperty('id');
    expect(body.user.email).toBe(registerData.email);
    expect(body.user.role).toBe('USER');

    // Assert password is NOt returned
    expect(body.user).not.toHaveProperty('password');

    // Assert tokens are non-empty strings
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
    expect(typeof body.refreshToken).toBe('string');
    expect(body.refreshToken.length).toBeGreaterThan(0);
  });

  it('should reject login with non-existent email', async () => {
    const loginResponse = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'Test1234!',
    });

    const body = loginResponse.body as ErrorResponse;
    expect(loginResponse.status).toBe(401);
    expect(body.error).toBe('Invalid credentials');

    // Should not reveal that email doesn't exist (security)
    expect(body.error).not.toContain('not found');
    expect(body.error).not.toContain('exist');
  });

  it('should reject login with incorrect password', async () => {
    // Register a user
    const registerData = {
      email: 'wrongpassword@example.com',
      password: 'CorrectPassword1!',
    };

    await request(app).post('/auth/register').send(registerData);

    const loginResponse = await request(app).post('/auth/login').send({
      email: registerData.email,
      password: 'WrongPassword1!',
    });

    const body = loginResponse.body as ErrorResponse;
    expect(loginResponse.status).toBe(401);
    expect(body.error).toBe('Invalid credentials');

    // Should not reveal that password is wrong
    expect(body.error).not.toContain('password');
  });

  it('should reject login with invalid input', async () => {
    const loginResponse = await request(app).post('/auth/login').send({
      email: 'not-an-email',
      password: '',
    });

    const body = loginResponse.body as ErrorResponse;
    expect(loginResponse.status).toBe(400);
    expect(body.error).toBe('Validation failed');
    expect(body.details).toBeInstanceOf(Array);
  });
});
