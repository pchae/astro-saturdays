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