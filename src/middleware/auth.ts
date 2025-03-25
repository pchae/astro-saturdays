import type { MiddlewareHandler } from 'astro';
import { defineMiddleware } from 'astro/middleware';
import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/lib/auth/types';
import { PROTECTED_ROUTES, isPublicRoute } from '@/lib/auth/utils/routes';
import { AuthErrors } from '@/lib/auth/utils/errors';

// Define route permission interface locally
interface RoutePermission {
  resource: string;
  action: 'read' | 'write' | 'admin';
  roles?: UserRole[];
}

// Create a separate Supabase client for validation
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

// Role hierarchy for permissions
const ROLE_LEVELS: Record<UserRole, number> = {
  [UserRole.ADMIN]: 3,
  [UserRole.USER]: 2,
  [UserRole.GUEST]: 1
};

// Action hierarchy for permissions
const ACTION_LEVELS: Record<string, number> = {
  'admin': 3,
  'write': 2,
  'read': 1
};

// Helper function for auth redirects
function handleAuthRedirect(context: any, path: string) {
  const { url, redirect } = context;
  
  // Don't add returnTo if we're already at signin
  if (path === '/signin' && !url.pathname.includes('/signin')) {
    // Only add returnTo for non-auth paths
    return redirect(`/signin?returnTo=${encodeURIComponent(url.pathname)}`);
  }
  
  // Regular redirect for other cases
  return redirect(path);
}

// Helper to get route permissions
function getRoutePermission(pathname: string): RoutePermission | null {
  // First try exact match
  if (pathname in PROTECTED_ROUTES) {
    return PROTECTED_ROUTES[pathname];
  }

  // Then try matching by prefix
  const matchingRoute = Object.keys(PROTECTED_ROUTES)
    .find(route => pathname.startsWith(route));

  return matchingRoute ? PROTECTED_ROUTES[matchingRoute] : null;
}

// Helper to check if role has required permission level
function hasPermission(userRole: string, permission: RoutePermission): boolean {
  if (!permission.roles) {
    return true; // If no roles specified, allow access
  }
  
  // Convert string role to UserRole enum
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
  
  // First check if route is public
  if (isPublicRoute(url.pathname)) {
    console.log('[Auth Middleware] Public route detected:', {
      path: url.pathname,
      skippingAuth: true
    });
    locals.metrics.operations++;
    return next();
  }

  console.log('[Auth Middleware] Processing request:', {
    path: url.pathname,
    hasSession: !!locals.session,
    hasUser: !!locals.user,
    sessionObject: locals.session ? JSON.stringify({
      isValid: locals.session.isValid,
      expiresAt: locals.session.expiresAt,
      expiresAtFormatted: new Date(locals.session.expiresAt).toISOString()
    }) : 'null',
    userObject: locals.user ? JSON.stringify({
      id: locals.user.id,
      email: locals.user.email,
      role: locals.user.role
    }) : 'null',
    timestamp: new Date().toISOString()
  });

  try {
    // Directly validate with Supabase to ensure session is valid
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (accessToken && refreshToken) {
      console.log('[Auth Debug] Double-checking tokens with Supabase');
      try {
        const { data, error } = await supabase.auth.getUser(accessToken);
        
        console.log('[Auth Debug] Supabase getUser result:', {
          hasData: !!data,
          hasError: !!error,
          errorMessage: error?.message,
          user: data?.user ? {
            id: data.user.id,
            role: data.user.role
          } : null
        });

        if (error || !data.user) {
          console.log('[Auth Debug] Supabase getUser failed, invalidating session');
          cookies.delete('sb-access-token', { path: '/' });
          cookies.delete('sb-refresh-token', { path: '/' });
          locals.metrics.operations++;
          return handleAuthRedirect(context, '/signin');
        }
      } catch (err) {
        console.error('[Auth Debug] Supabase getUser threw exception:', err);
        cookies.delete('sb-access-token', { path: '/' });
        cookies.delete('sb-refresh-token', { path: '/' });
        locals.metrics.operations++;
        return handleAuthRedirect(context, '/signin');
      }
    }

    // DEBUG: Check exact session state
    if (!locals.session) {
      console.log('[Auth Debug] Session object is completely missing');
      locals.metrics.operations++;
      return handleAuthRedirect(context, '/signin');
    }
    
    if (!locals.session.isValid) {
      console.log('[Auth Debug] Session is not valid:', {
        expiresAt: locals.session.expiresAt,
        currentTime: Date.now(),
        diff: locals.session.expiresAt - Date.now(),
        expiresAtFormatted: new Date(locals.session.expiresAt).toISOString()
      });
      locals.metrics.operations++;
      return handleAuthRedirect(context, '/signin');
    }
    
    if (!locals.user) {
      console.log('[Auth Debug] User object is missing despite valid session');
      locals.metrics.operations++;
      return handleAuthRedirect(context, '/signin');
    }
    
    // Check route permissions
    const routePermission = getRoutePermission(url.pathname);
    if (routePermission) {
      const hasRequiredPermission = hasPermission(locals.user.role, routePermission);
      if (!hasRequiredPermission) {
        locals.metrics.operations++;
        throw AuthErrors.forbidden();
      }
    }

    locals.metrics.operations++;
    return next();
  } catch (error) {
    console.error('[Auth Middleware Error]', {
      path: url.pathname,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    locals.metrics.operations++;
    return handleAuthRedirect(context, '/signin');
  }
}) satisfies MiddlewareHandler; 