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