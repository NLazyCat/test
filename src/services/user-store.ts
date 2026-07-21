// ── In-memory user store ──────────────────────────────────────────────────

import type { User, UserRole } from '../types/user';
import { generateId } from '../utils/helpers';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../constants';

interface StoredUser extends User {
  passwordHash: string;
}

const users: Map<string, StoredUser> = new Map();

export async function createUser(
  email: string,
  name: string,
  password: string,
  role: UserRole,
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const now = new Date();
  const user: StoredUser = {
    id: generateId(),
    email,
    name,
    role,
    createdAt: now,
    updatedAt: now,
    passwordHash,
  };
  users.set(user.id, user);
  return { ...user, passwordHash: undefined } as unknown as User;
}

export function getUserById(id: string): User | undefined {
  const found = users.get(id);
  if (!found) return undefined;
  return { ...found, passwordHash: undefined } as unknown as User;
}

export function getUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email === email) {
      return { ...user, passwordHash: undefined } as unknown as User;
    }
  }
  return undefined;
}

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  for (const user of users.values()) {
    if (user.email === email) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (match) return { ...user, passwordHash: undefined } as unknown as User;
    }
  }
  return null;
}

export function updateUser(id: string, changes: Partial<User>): User | undefined {
  const existing = users.get(id);
  if (!existing) return undefined;
  const updated: StoredUser = { ...existing, ...changes, updatedAt: new Date() };
  users.set(id, updated);
  return { ...updated, passwordHash: undefined } as unknown as User;
}

export function deleteUser(id: string): boolean {
  return users.delete(id);
}

export function listUsers(): User[] {
  return Array.from(users.values()).map(u => ({ ...u, passwordHash: undefined }) as unknown as User);
}

/** For testing — clears all users */
export function _resetUsers(): void {
  users.clear();
}
