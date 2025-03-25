import type { User } from '@supabase/supabase-js';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface RoutePermission {
  resource: string;
  action: 'read' | 'write' | 'admin';
  roles?: UserRole[];
}

export interface AuthSession {
  isValid: boolean;
  expiresAt: number;
  user?: User;
}

export interface AuthError {
  code: string;
  message: string;
  status: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser extends User {
  role: UserRole;
}

export type AuthResponse = {
  success: boolean;
  data?: {
    session: AuthSession | null;
    user: AuthUser | null;
  };
  error?: AuthError;
}; 