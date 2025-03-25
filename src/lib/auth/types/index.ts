import type { AstroGlobal } from 'astro';
import type { APIContext } from 'astro';
import type { User } from '@supabase/supabase-js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionData {
  user: User;
  tokens: AuthTokens;
  expiresAt: number;
}

export interface CookieOptions {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  maxAge?: number;
}

// Astro context can be either AstroGlobal or APIContext
export type AstroContext = { cookies: AstroGlobal['cookies'] } | AstroGlobal;

export interface CookieResult<T> {
  data: T | null;
  error: Error | null;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface AuthError {
  code: string;
  message: string;
  status: number;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type AuthResponse = {
  success: boolean;
  data?: {
    session: AuthSession | null;
    user: AuthUser | null;
  };
  error?: AuthError;
}; 