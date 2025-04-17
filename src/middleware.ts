import type { MiddlewareHandler, APIContext } from 'astro';
import type { AstroGlobal } from 'astro';
import { defineMiddleware } from 'astro/middleware';
import { createClient, type Session, type User } from '@supabase/supabase-js';
import type { Session as SupabaseSession } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth';
import type { AuthConfig, AuthContext, AuthState, RoutePermission, AuthSession } from '@/types/auth';
import { AuthErrors, SessionError, UnauthorizedError } from '@/lib/errors/auth';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// TODO - APRIL 16 2025:
// - Remove old, unused imports
// - Remove commented out code
// - Fix the redundant logic for PUBLIC AND PROTECTED ROUTES BELOW
// - Create parity with the folio project's middleware



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

// --- Configuration ---
// Keep your existing route definitions
const protectedRoutes = ["/dashboard", "/settings", "/admin"]; // Routes requiring login
const publicOnlyRoutes = ["/signin", "/register", "/reset-password", "/verify"]; // Routes for logged-out users only
const adminRoutes = ["/admin"]; // Routes requiring admin role (adjust if needed)

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const signInPath = '/signin';
const dashboardPath = '/dashboard';
// --- End Configuration ---

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

// Simplified permission check - verify how user.role is set (e.g., custom claims)
// If user.role isn't available, you might need context.locals.session?.user?.app_metadata?.roles or similar
function hasRequiredRole(user: User | null, requiredRoles: UserRole[]): boolean {
    if (!user || !requiredRoles.length) {
        return false;
    }
    // ASSUMPTION: user.role exists (e.g., via custom claims). Adjust if needed.
    const userRole = (user.role as UserRole) || UserRole.GUEST;
    return requiredRoles.includes(userRole);
}

// Type the context parameter explicitly
export const onRequest = defineMiddleware(async (context: APIContext, next) => {
  // Explicitly type locals for better type safety
  // @ts-ignore - IDE linter struggles with locals type here
  const locals = context.locals as App.Locals;
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  // Initialize metrics if needed
  // @ts-ignore - IDE linter struggles with locals type here
  if (typeof locals.metrics === 'undefined') {
    // @ts-ignore - IDE linter struggles with locals type here
    locals.metrics = { operations: 0 };
  }
  // @ts-ignore - IDE linter struggles with locals type here
  locals.metrics.operations++; // Increment metric count early

  // --- Use @supabase/ssr ---
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (key) => cookies.get(key)?.value,
      set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
      remove: (key, options) => cookies.delete(key, { ...options, path: '/' }),
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  // Store the Supabase client, session, and user in locals
  // @ts-ignore - IDE linter struggles with locals type here
  locals.supabase = supabase;
  // @ts-ignore - IDE linter struggles with locals type here
  locals.session = session;
  // @ts-ignore - IDE linter struggles with locals type here
  locals.user = user;

  console.log(`[Middleware] Path: ${pathname}, User: ${user?.email ?? 'None'}, Session: ${session ? 'Exists' : 'None'}`);

  // --- Redirect Logic ---

  // 1. Check Protected Routes
  const isProtectedRoute = protectedRoutes.some(prefix => pathname.startsWith(prefix));
  if (isProtectedRoute && !session) {
    console.log(`[Middleware] No session, accessing protected route. Redirecting to ${signInPath}.`);
    // Optionally add redirect target: return redirect(`${signInPath}?redirect=${encodeURIComponent(pathname)}`);
    return redirect(signInPath);
  }

  // 2. Check Public-Only Routes (FIX for ERR_TOO_MANY_REDIRECTS)
  const isPublicOnlyRoute = publicOnlyRoutes.some(prefix => pathname.startsWith(prefix));
  if (isPublicOnlyRoute && session) {
    console.log(`[Middleware] Session found, accessing public-only route. Redirecting to ${dashboardPath}.`);
    return redirect(dashboardPath);
  }

  // 3. Check Role-Based Permissions (Example for Admin)
  const isAdminRoute = adminRoutes.some(prefix => pathname.startsWith(prefix));
  if (isAdminRoute && session) { // Only check roles if logged in
      // Adjust role check based on how roles are stored (user.role, app_metadata, etc.)
      if (!hasRequiredRole(user, [UserRole.ADMIN])) {
          console.log(`[Middleware] User ${user?.email} lacks ADMIN role for ${pathname}. Redirecting.`);
          // Redirect non-admins away from admin routes (e.g., to dashboard or show a 'Forbidden' page)
          return redirect(dashboardPath); // Or context.rewrite('/forbidden') if you have such a page
      }
  }

  // --- End Redirect Logic ---

  // If no redirects triggered, proceed to the page
  console.log(`[Middleware] No redirect needed for ${pathname}. Proceeding.`);
  return next();
}); 