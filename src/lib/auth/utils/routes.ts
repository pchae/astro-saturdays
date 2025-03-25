import { UserRole } from './types';

interface RoutePermission {
  resource: string;
  action: 'read' | 'write' | 'admin';
  roles?: UserRole[];
}

export const PROTECTED_ROUTES: Record<string, RoutePermission> = {
  '/dashboard': {
    resource: 'dashboard',
    action: 'read',
    roles: [UserRole.USER, UserRole.ADMIN]
  },
  '/settings': {
    resource: 'settings',
    action: 'write',
    roles: [UserRole.USER, UserRole.ADMIN]
  },
  '/admin': {
    resource: 'admin',
    action: 'admin',
    roles: [UserRole.ADMIN]
  },
  '/profile': {
    resource: 'profile',
    action: 'write',
    roles: [UserRole.USER, UserRole.ADMIN]
  }
};

export const PUBLIC_ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/privacy',
  '/terms'
];

export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    path === route || 
    path.startsWith(`${route}/`) ||
    // Allow static assets and API routes
    path.startsWith('/_astro/') ||
    path.startsWith('/api/public/')
  );
} 