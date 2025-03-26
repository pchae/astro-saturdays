import type { AstroGlobal } from 'astro';
import type { AuthConfig, AuthContext } from './types';
import { authMiddleware } from './auth';

/**
 * Protect a route with auth middleware
 */
export async function protectRoute(
  context: AstroGlobal,
  config?: AuthConfig
): Promise<AuthContext> {
  const result = await authMiddleware(context, config);
  
  if (result instanceof Response) {
    throw result;
  }
  
  return result;
}

/**
 * Get auth context for the current request
 * Does not redirect or throw errors for unauthorized access
 */
export async function getAuthContext(
  context: AstroGlobal,
  config?: AuthConfig
): Promise<AuthContext> {
  const result = await authMiddleware(context, {
    ...config,
    publicRoutes: ['*'] // Treat all routes as public
  });
  
  if (result instanceof Response) {
    throw new Error('Unexpected redirect in public route');
  }
  
  return result;
}

/**
 * Helper to extract user from auth context
 * Throws if user is not authenticated
 */
export function requireUser(context: AuthContext) {
  if (!context.state.user) {
    throw new Error('User is not authenticated');
  }
  return context.state.user;
} 