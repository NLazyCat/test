// ── User domain types ─────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  Member = 'member',
  Viewer = 'viewer',
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
