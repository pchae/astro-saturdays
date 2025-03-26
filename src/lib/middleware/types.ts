import type { Session, User } from '@supabase/supabase-js';
import type { AstroGlobal } from 'astro';

/**
 * Auth session state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Auth middleware configuration
 */
export interface AuthConfig {
  /** Routes that don't require authentication */
  publicRoutes?: string[];
  /** Route to redirect to when auth fails */
  authFailRedirect?: string;
  /** Route to redirect to after successful login */
  afterAuthRedirect?: string;
}

/**
 * Auth context passed to middleware handlers
 */
export interface AuthContext {
  /** Astro global context */
  context: AstroGlobal;
  /** Current auth state */
  state: AuthState;
  /** Auth configuration */
  config: AuthConfig;
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