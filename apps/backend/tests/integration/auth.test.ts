import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { resetTestDatabase, disconnectDatabase } from '../helpers/testDb.js';

// Run once before all tests in this file
beforeAll(async () => {
  await resetTestDatabase();
});

// Run before each test to ensure clean state
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

    // Assert response body structure
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe('test@example.com');
    expect(response.body.user.role).toBe('USER');

    // Assert password is NOT returned
    expect(response.body.user).not.toHaveProperty('password');
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

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Email already exists');
  });

  it('should validate input and reject invalid data', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'not-an-email',
      password: 'weak',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
    expect(response.body.details).toBeInstanceOf(Array);
  });
});
