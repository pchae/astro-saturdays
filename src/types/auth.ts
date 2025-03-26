import type { Session, User } from '@supabase/supabase-js';
import type { AstroGlobal } from 'astro';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthConfig {
  /** Routes that don't require authentication */
  publicRoutes?: string[];
  /** Route to redirect to when auth fails */
  authFailRedirect?: string;
  /** Route to redirect to after successful login */
  afterAuthRedirect?: string;
}

export interface AuthContext {
  /** Astro global context */
  context: AstroGlobal;
  /** Current auth state */
  state: AuthState;
  /** Auth configuration */
  config: AuthConfig;
}

export interface AuthSession {
  isValid: boolean;
  expiresAt: number;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    session: AuthSession;
    user: User & { role: UserRole };
  };
  error?: Error;
}

/**
 * Auth error types
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class SessionError extends AuthError {
  constructor(message = 'Invalid or expired session') {
    super(message, 'AUTH_SESSION_ERROR', 401);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized access') {
    super(message, 'AUTH_UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = 'Access forbidden') {
    super(message, 'AUTH_FORBIDDEN', 403);
  }
} 