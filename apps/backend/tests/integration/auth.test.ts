import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { resetTestDatabase, disconnectDatabase } from '../helpers/testDb.js';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env.js';

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

interface MeResponse {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: { field: string; message: string }[];
}

interface RefreshResponse {
  accessToken: string;
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

describe('POST /api/auth/register', () => {
  it('should successfully register a new user with valid data', async () => {
    const response = await request(app).post('/api/auth/register').send({
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
    await request(app).post('/api/auth/register').send({
      email: 'duplicate@example.com',
      password: 'Test1234!',
    });

    // Second registration with same email
    const response = await request(app).post('/api/auth/register').send({
      email: 'duplicate@example.com',
      password: 'DifferentPassword1!',
    });

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(409);
    expect(body.error).toBe('Email already exists');
  });

  it('should validate input and reject invalid data', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: 'weak',
    });

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(400);
    expect(body.error).toBe('Validation failed');
    expect(body.details).toBeInstanceOf(Array);
  });
});

describe('POST /api/auth/login', () => {
  it('should successfully login with valid credentials', async () => {
    // First register a user
    const registerData = {
      email: 'logintest@example.com',
      password: 'Test1234!',
      role: 'USER',
    };

    await request(app).post('/api/auth/register').send(registerData);

    // Login with same credentials
    const loginResponse = await request(app).post('/api/auth/login').send({
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
    const loginResponse = await request(app).post('/api/auth/login').send({
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

    await request(app).post('/api/auth/register').send(registerData);

    const loginResponse = await request(app).post('/api/auth/login').send({
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
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: '',
    });

    const body = loginResponse.body as ErrorResponse;
    expect(loginResponse.status).toBe(400);
    expect(body.error).toBe('Validation failed');
    expect(body.details).toBeInstanceOf(Array);
  });
});

describe('GET /api/auth/me', () => {
  it('should return user info with valid token', async () => {
    // Register and login to get token
    const registerData = {
      email: 'tokentest@example.com',
      password: 'Test1234!',
    };
    await request(app).post('/api/auth/register').send({
      email: registerData.email,
      password: registerData.password,
    });
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: registerData.email,
      password: registerData.password,
    });

    const { accessToken } = loginResponse.body as LoginSuccessResponse;

    // Use token to access protected route
    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    const meBody = meResponse.body as MeResponse;
    // Assert response
    expect(meResponse.status).toBe(200);
    expect(meBody).toHaveProperty('user');
    expect(meBody.user).toHaveProperty('userId');
    expect(meBody.user).toHaveProperty('email');
    expect(meBody.user).toHaveProperty('role');
    expect(meBody.user.email).toBe(registerData.email);
  });

  it('should return 401 when no token provided', async () => {
    const response = await request(app).get('/api/auth/me');

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(401);
    expect(body.error).toBe('Authentication required');
  });

  it('should return 401 when token format is invalid', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'InvalidFormat');

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(401);
    expect(body.error).toBe('Authentication required');
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(401);
    expect(body.error).toBe('Invalid token');
  });

  it('should return401 when token is expired', async () => {
    // make expired token
    const expiredToken = jwt.sign(
      { userId: 'test', email: 'test@example.com', role: 'USER' },
      env.JWT_SECRET,
      { expiresIn: '-1h' } // Negative = alrealy expired
    );

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    const body = response.body as ErrorResponse;
    expect(response.status).toBe(401);
    expect(body.error).toBe('Token expired');
  });
});

describe('POST /api/auth/refresh', () => {
  it('should return new access token with valid refresh token', async () => {
    const registerData = {
      email: 'refresh@example.com',
      password: 'Test1234!',
    };

    // Register and login to get token
    await request(app).post('/api/auth/register').send({
      email: registerData.email,
      password: registerData.password,
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: registerData.email,
      password: registerData.password,
    });

    const { refreshToken } = loginResponse.body as LoginSuccessResponse;

    // Use refresh token to get new access token
    const refreshResponse = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    const refreshBody = refreshResponse.body as RefreshResponse;
    // Assert response
    expect(refreshResponse.status).toBe(200);
    expect(refreshBody).toHaveProperty('accessToken');
    expect(typeof refreshBody.accessToken).toBe('string');
    expect(refreshBody.accessToken.length).toBeGreaterThan(0);

    // Verify new access token works
    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${refreshBody.accessToken}`);

    expect(meResponse.status).toBe(200);
  });

  it('should return 401 with invalid refresh token', async () => {
    const response = await request(app).post('/api/auth/refresh').send({
      refreshToken: 'Invalid.token.here',
    });

    const errorBody = response.body as ErrorResponse;
    expect(response.status).toBe(401);
    expect(errorBody.error).toBe('Invalid or expired refresh token');
  });

  it('should return 401 with expired refresh token', async () => {
    // Create a refresh token thatexpired 1 day ago
    const expiredRefreshToken = jwt.sign(
      { userId: 'test-id', email: 'test@example.com', role: 'USER' },
      env.JWT_SECRET,
      { expiresIn: '-1d' }
    );

    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: expiredRefreshToken });

    const errorBody = response.body as ErrorResponse;
    expect(response.status).toBe(401);
    expect(errorBody.error).toBe('Invalid or expired refresh token');
  });

  it('should return 400 when refresh token is missing', async () => {
    const response = await request(app).post('/api/auth/refresh').send({});

    const errorBody = response.body as ErrorResponse;
    expect(response.status).toBe(400);
    expect(errorBody.error).toBe('Validation failed');
  });
});

describe('POST /api/auth/logout', () => {
  it('should logout successfully with valid refresh token', async () => {
    const registerData = {
      email: 'logout@example.com',
      password: 'Test1234!',
    };
    // First register and login to get a refresh token
    await request(app).post('/api/auth/register').send({
      email: registerData.email,
      password: registerData.password,
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: registerData.email,
      password: registerData.password,
    });

    const { refreshToken } = loginResponse.body as LoginSuccessResponse;

    // Logout with refresh token
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken });

    // Assert 204 No Content
    expect(logoutResponse.status).toBe(204);
    expect(logoutResponse.body).toEqual({}); // Empty body for 204

    // Verify refresh token is now invalid (deleted from DB)
    const refreshAttempt = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshAttempt.status).toBe(401);
    const refreshBody = refreshAttempt.body as ErrorResponse;
    expect(refreshBody.error).toBe('Invalid or expired refresh token');
  });

  it('should return 401 when logging out with invalid token', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'invalid.token.here' });

    const errorBody = response.body as ErrorResponse;
    expect(response.status).toBe(401);
    expect(errorBody.error).toBe('Invalid refresh token');
  });

  it('should return 401 when logging out with non-existent token', async () => {
    // Create a valid JWT, but it's not in the database
    const validButNotStoredToken = jwt.sign(
      { userId: 'test-id', email: 'test@example.com', role: 'USER' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: validButNotStoredToken });

    expect(response.status).toBe(401);
    const errorBody = response.body as ErrorResponse;
    expect(errorBody.error).toBe('Invalid refresh token');
  });

  it('should return 400 when refresh token is missing', async () => {
    const response = await request(app).post('/api/auth/logout').send({});

    expect(response.status).toBe(400);
    const errorBody = response.body as ErrorResponse;
    expect(errorBody.error).toBe('Validation failed');
  });
});
