// ── Authentication service ────────────────────────────────────────────────

import jwt from 'jsonwebtoken';
import type { User } from '../types/user';
import { getUserByEmail, verifyPassword, getUserById } from './user-store';
import { JWT_EXPIRES_IN, JWT_ALGORITHM } from '../constants';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export async function login(email: string, password: string): Promise<{ token: string; user: User } | null> {
  const user = await verifyPassword(email, password);
  if (!user) return null;

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
  });

  return { token, user };
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(tokenPayload: TokenPayload): User | undefined {
  return getUserById(tokenPayload.userId);
}
