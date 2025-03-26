import type { AstroGlobal } from 'astro';
import { createClient } from '@/lib/supabase/server';
import type { AuthConfig, AuthContext, AuthState } from '@/types/auth';
import { SessionError, UnauthorizedError } from '@/lib/api/server/errors';

const DEFAULT_CONFIG: AuthConfig = {
  publicRoutes: ['/login', '/register', '/reset-password'],
  authFailRedirect: '/login',
  afterAuthRedirect: '/dashboard'
};

/**
 * Get current auth state
 */
async function getAuthState(context: AstroGlobal): Promise<AuthState> {
  const supabase = createClient(context);
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return {
      session,
      user: session?.user ?? null,
      isLoading: false,
      error: null
    };
  } catch (error) {
    return {
      session: null,
      user: null,
      isLoading: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Check if route is public
 */
function isPublicRoute(path: string, publicRoutes: string[] = []): boolean {
  return publicRoutes.some(route => {
    if (route.includes('*')) {
      const baseRoute = route.replace('*', '');
      return path.startsWith(baseRoute);
    }
    return path === route;
  });
}

/**
 * Auth middleware handler
 */
export async function authMiddleware(
  context: AstroGlobal,
  config: AuthConfig = {}
): Promise<AuthContext | Response> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const state = await getAuthState(context);
  const url = new URL(context.request.url);
  
  // Allow public routes
  if (isPublicRoute(url.pathname, mergedConfig.publicRoutes)) {
    return { context, state, config: mergedConfig };
  }
  
  // Check for valid session
  if (!state.session) {
    if (context.request.headers.get('accept')?.includes('application/json')) {
      throw new UnauthorizedError();
    }
    
    if (!mergedConfig.authFailRedirect) {
      throw new Error('Auth fail redirect not configured');
    }
    
    return context.redirect(mergedConfig.authFailRedirect);
  }
  
  // Session expired
  if (state.session.expires_at && Date.now() > state.session.expires_at * 1000) {
    throw new SessionError();
  }
  
  return { context, state, config: mergedConfig };
}

/**
 * Create auth middleware with custom config
 */
export function createAuthMiddleware(config: AuthConfig = {}) {
  return (context: AstroGlobal) => authMiddleware(context, config);
} 