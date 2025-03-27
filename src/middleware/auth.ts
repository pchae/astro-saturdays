import type { MiddlewareHandler, APIContext } from 'astro';
import type { AstroGlobal } from 'astro';
import { defineMiddleware } from 'astro/middleware';
import { createClient, type Session, type User } from '@supabase/supabase-js';
import type { Session as SupabaseSession } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth';
import type { AuthConfig, AuthContext, AuthState, RoutePermission, AuthSession } from '@/types/auth';
import { AuthErrors, SessionError, UnauthorizedError } from '@/lib/errors/auth';

// Default configuration
const DEFAULT_CONFIG: AuthConfig = {
  publicRoutes: [
    '/',
    '/about',
    '/signin',
    '/register',
    '/privacy',
    '/reset-password',
    '/verify',
    '/404'
  ],
  authFailRedirect: '/signin',
  afterAuthRedirect: '/dashboard'
};

// Define protected routes and their permissions
export const PROTECTED_ROUTES: Record<string, RoutePermission> = {
  '/dashboard': { roles: [UserRole.USER, UserRole.ADMIN] },
  '/settings': { roles: [UserRole.USER, UserRole.ADMIN] },
  '/admin': { roles: [UserRole.ADMIN] }
};

/**
 * Get current auth state by verifying token with Supabase server
 */
async function getAuthState(cookies: APIContext['cookies']): Promise<AuthState> {
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );

  try {
    // Extract access token from cookies
    const accessToken = cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      // No token, clearly no session
      return { session: null, user: null, isLoading: false, error: null };
    }

    // Replace getSession with getUser(token)
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      // Token might be invalid or expired
      console.warn('[Auth Middleware] getUser error:', error.message);
      // Optionally clear cookies here if token is invalid
      // cookies.delete('sb-access-token', { path: '/' });
      // cookies.delete('sb-refresh-token', { path: '/' });
      return { session: null, user: null, isLoading: false, error };
    }

    // If getUser succeeds, we have a valid user, but maybe not the full session object
    // Depending on needs, you might need to construct a partial session-like object
    // Or decide if just having the `user` object is sufficient for `locals`
    const partialSession = user ? {
      access_token: accessToken, // We have this
      token_type: 'bearer', // Assuming bearer
      user: user, // We have the validated user
      // expires_at, refresh_token etc. might be missing or inaccurate without getSession
      // If expires_at is crucial, you might need a different approach or accept potential inaccuracy
      expires_at: undefined // Mark as potentially unknown
    } as Session : null;


    return {
      session: partialSession, // Use the reconstructed/validated data
      user: user ?? null,
      isLoading: false,
      error: null
    };
  } catch (error) {
     console.error('[Auth Middleware] Unexpected error in getAuthState:', error);
    return {
      session: null,
      user: null,
      isLoading: false,
      error: error instanceof Error ? error : new Error('Unknown error in getAuthState')
    };
  }
}

/**
 * Check if route is public
 */
export function isPublicRoute(path: string, publicRoutes?: string[]): boolean {
  // Use default routes if none provided, ensure it's always an array
  const routes = publicRoutes ?? DEFAULT_CONFIG.publicRoutes ?? [];
  return routes.some(route => {
    if (route.includes('*')) {
      const baseRoute = route.replace('*', '');
      return path.startsWith(baseRoute);
    }
    return path === route || path.startsWith('/api/');  // Allow API routes
  });
}

// Helper to check if role has required permission level
function hasPermission(userRole: string | undefined, permission: RoutePermission): boolean {
  if (!permission.roles || !userRole) {
    return false;
  }
  
  let role: UserRole;
  switch (userRole) {
    case 'admin':
      role = UserRole.ADMIN;
      break;
    case 'user':
      role = UserRole.USER;
      break;
    default:
      role = UserRole.GUEST;
  }

  return permission.roles.includes(role);
}

export const authMiddleware = defineMiddleware(async (context, next) => {
  const { locals, url, cookies } = context;
  const config = { ...DEFAULT_CONFIG };
  
  // Pass cookies to getAuthState
  const state = await getAuthState(cookies);
  
  // First check if route is public
  if (isPublicRoute(url.pathname, config.publicRoutes)) {
    console.log('[Auth Middleware] Public route detected:', {
      path: url.pathname,
      skippingAuth: true
    });
    locals.metrics.operations++;
    return next();
  }

  console.log('[Auth Middleware] Processing request:', {
    path: url.pathname,
    hasSession: !!state.session,
    hasUser: !!state.user,
    timestamp: new Date().toISOString()
  });

  try {
    if (!state.session || !state.user) {
      console.log('[Auth Debug] No valid session found');
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
      locals.metrics.operations++;
      
      // Check if request expects JSON
      if (context.request.headers.get('accept')?.includes('application/json')) {
        throw new UnauthorizedError();
      }
      
      return context.redirect(config.authFailRedirect || '/signin');
    }

    // Check for session expiration - This part needs careful review
    // as partialSession might not have expires_at correctly
    // if (state.session?.expires_at && Date.now() > state.session.expires_at * 1000) {
    //   console.warn('[Auth Middleware] Session potentially expired (based on partial data)');
    //   // throw new SessionError(); // Re-evaluate if this check is reliable now
    // }

    // Check route permissions
    const routePermission = PROTECTED_ROUTES[url.pathname];
    if (routePermission) {
      const hasRequiredPermission = hasPermission(state.user.role, routePermission);
      if (!hasRequiredPermission) {
        locals.metrics.operations++;
        throw AuthErrors.forbidden();
      }
    }

    // Store auth state in locals with proper typing
    locals.session = state.session ? {
      ...state.session,
      isValid: true, // Since getUser succeeded
      expiresAt: state.session.expires_at ? state.session.expires_at * 1000 : undefined // expires_at might be undefined now
    } as AuthSession : undefined;
    locals.user = state.user;
    locals.metrics.operations++;
    
    return next();
  } catch (error) {
    console.error('[Auth Middleware Error]', {
      path: url.pathname,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    locals.metrics.operations++;
    
    if (error instanceof UnauthorizedError || error instanceof SessionError) {
      return context.redirect(config.authFailRedirect || '/signin');
    }
    
    throw error;
  }
}) satisfies MiddlewareHandler; 