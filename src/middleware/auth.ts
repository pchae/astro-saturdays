import type { MiddlewareHandler, APIContext } from 'astro';
import type { AstroGlobal } from 'astro';
import { defineMiddleware } from 'astro/middleware';
import { createClient } from '@supabase/supabase-js';
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
 * Get current auth state
 */
async function getAuthState(context: APIContext | AstroGlobal): Promise<AuthState> {
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
  
  // Get current auth state
  const state = await getAuthState(context);
  
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

    // Check for session expiration
    if (state.session.expires_at && Date.now() > state.session.expires_at * 1000) {
      throw new SessionError();
    }

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
    locals.session = {
      ...state.session,
      isValid: true,
      expiresAt: state.session.expires_at ? state.session.expires_at * 1000 : Date.now() + 3600000 // 1 hour default
    } as AuthSession;
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