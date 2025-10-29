import bcrypt from 'bcryptjs';
import getPrisma from '../lib/prisma.js';
import { env } from '../config/env.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

// JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

interface RegisterResult {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export async function register(data: RegisterInput): Promise<RegisterResult> {
  const prisma = getPrisma();

  const { email, password, role } = data;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return user;
}

export async function login(data: LoginInput): Promise<LoginResult> {
  const prisma = getPrisma();

  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
    },
  });

  // Check if user with this email exists and is active
  if (!user?.isActive) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Calculate refresh token expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Return token and user info (exclude password)
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * Generate access tocken (short-lived)
 */
function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN, // '15m
  } as jwt.SignOptions);
}

/**
 * Generate refresh token (long-lived)
 */
function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as string | number, // '7d
  } as jwt.SignOptions);
}
