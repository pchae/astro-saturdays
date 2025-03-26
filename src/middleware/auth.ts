import type { MiddlewareHandler } from 'astro';
import { defineMiddleware } from 'astro/middleware';
import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth';
import type { RoutePermission } from '@/types/auth';
import { AuthErrors } from '@/lib/errors/auth';

// Define protected routes and their permissions
export const PROTECTED_ROUTES: Record<string, RoutePermission> = {
  '/dashboard': { roles: [UserRole.USER, UserRole.ADMIN] },
  '/settings': { roles: [UserRole.USER, UserRole.ADMIN] },
  '/admin': { roles: [UserRole.ADMIN] }
};

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/signin', '/signup', '/reset-password', '/verify'];

/**
 * Check if route is public
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route.includes('*')) {
      const baseRoute = route.replace('*', '');
      return path.startsWith(baseRoute);
    }
    return path === route;
  });
}

// Helper to check if role has required permission level
function hasPermission(userRole: string | undefined, permission: RoutePermission): boolean {
  if (!permission.roles || !userRole) {
    return false; // If no roles specified or no user role, deny access
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
    // Create a new Supabase client for this request
    const client = createClient(
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

    // Validate the session
    const { data: { user }, error } = await client.auth.getUser();

    if (error || !user) {
      console.log('[Auth Debug] Supabase getUser failed, invalidating session');
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
      locals.metrics.operations++;
      throw AuthErrors.unauthorized();
    }

    // Check route permissions
    const routePermission = PROTECTED_ROUTES[url.pathname];
    if (routePermission) {
      const hasRequiredPermission = hasPermission(user.role, routePermission);
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
    return Response.redirect(new URL('/signin', url), 302);
  }
}) satisfies MiddlewareHandler; 