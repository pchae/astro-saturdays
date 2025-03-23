# Authentication Consolidation Plan

## Overview
This document outlines the plan for consolidating and improving the authentication system in Astro Saturdays. The goal is to reduce complexity, improve maintainability, and enhance performance by centralizing auth logic and optimizing operations.

## 1. Core Components

### 1.1 Types and Interfaces

```typescript
// Core authentication types
interface AuthResult {
  user: User | null;
  session: Session | null;
  error?: AuthError;
}

interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface User {
  id: string;
  email: string;
  role: UserRole;
  metadata: UserMetadata;
}

// Error handling
interface AuthError extends Error {
  code: AuthErrorCode;
  status: number;
  details?: Record<string, any>;
}

enum AuthErrorCode {
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  SESSION_EXPIRED = 'auth/session-expired',
  UNAUTHORIZED = 'auth/unauthorized',
  FORBIDDEN = 'auth/forbidden',
  NETWORK_ERROR = 'auth/network-error',
  UNKNOWN = 'auth/unknown'
}

// Configuration
interface AuthConfig {
  supabaseUrl: string;
  supabaseKey: string;
  cookieOptions: CookieOptions;
  redirects: AuthRedirects;
}

interface CookieOptions {
  name: string;
  lifetime: number;
  domain?: string;
  path: string;
  sameSite: 'strict' | 'lax' | 'none';
}

interface AuthRedirects {
  signIn: string;
  signOut: string;
  unauthorized: string;
  callback: string;
}

// Service interfaces
interface IAuthService {
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  refreshSession(): Promise<void>;
  requireAuth(astro: AstroGlobal): Promise<void>;
  handleAuthError(error: AuthError): Response;
}

interface ISessionManager {
  validateSession(token: string): Promise<Session>;
  refreshToken(session: Session): Promise<Session>;
  clearSession(): Promise<void>;
  setSession(session: Session): Promise<void>;
}

interface IRouteGuard {
  checkAuth(astro: AstroGlobal): Promise<boolean>;
  handleRedirect(path: string): Response;
  validatePermissions(user: User, resource: string): boolean;
}
```

## 2. Implementation Phases

### Phase 1: Foundation (Week 1)
1. Create new directory structure:
   ```
   src/lib/auth/
   ├── AuthService.ts
   ├── SessionManager.ts
   ├── RouteGuard.ts
   ├── types.ts
   ├── errors.ts
   ├── config.ts
   └── middleware.ts
   ```

2. Implement core types and interfaces
3. Set up AuthService skeleton
4. Add basic error handling
5. Write initial tests

### Phase 2: Core Implementation (Week 1-2)
1. Implement SessionManager:
   - Session validation
   - Token refresh
   - Cookie management
   - Session caching

2. Implement RouteGuard:
   - Auth checks
   - Redirect handling
   - Permission validation

3. Complete AuthService implementation:
   - Sign in/out flows
   - Session management
   - Error handling
   - Event system

### Phase 3: Migration (Week 2-3)
1. Create migration utilities
2. Update existing routes:
   - Add new auth middleware
   - Replace old auth checks
   - Update error handling

3. Migrate API endpoints:
   - Update signin endpoint
   - Update session handling
   - Add new error responses

4. Test and validate changes

### Phase 4: Cleanup and Documentation (Week 3)
1. Remove deprecated code
2. Update documentation
3. Add usage examples
4. Performance testing
5. Security review

## 3. Testing Strategy

### 3.1 Unit Tests
- AuthService core methods
- SessionManager validation
- RouteGuard checks
- Error handling

### 3.2 Integration Tests
- Complete auth flow
- Session refresh flow
- Protected routes
- Error scenarios

### 3.3 Performance Tests
- Session validation speed
- Cookie operation overhead
- Cache hit rates
- Response times

## 4. Migration Guides

### 4.1 Route Updates
```typescript
// Before
const { user } = Astro.locals;
if (!user) {
  return Astro.redirect('/login');
}

// After
await authService.requireAuth(Astro);
```

### 4.2 API Endpoints
```typescript
// Before
try {
  const { data: { user } } = await supabase.auth.getUser();
  // ...
} catch (error) {
  return new Response('Unauthorized', { status: 401 });
}

// After
try {
  const session = await authService.getSession();
  // ...
} catch (error) {
  return authService.handleAuthError(error);
}
```

## 5. Rollback Plan

1. Keep old auth code in separate branch
2. Maintain dual auth systems during migration
3. Feature flags for gradual rollout
4. Monitoring and alerts setup
5. Quick rollback procedure documented

## 6. Success Metrics

1. Performance:
   - Reduce auth operations per request from 7-8 to 2-3
   - Session validation under 50ms
   - Cache hit rate > 90%

2. Maintenance:
   - Reduce auth-related code by 40%
   - Centralize error handling
   - Improve test coverage to >80%

3. User Experience:
   - Faster auth flows
   - Consistent error messages
   - Reduced session issues

## 7. Timeline

Week 1:
- Foundation setup
- Core implementation start
- Initial testing

Week 2:
- Complete core implementation
- Begin migration
- Integration testing

Week 3:
- Complete migration
- Cleanup
- Documentation
- Performance optimization

## 8. Future Improvements

1. Add support for:
   - OAuth providers
   - Magic links
   - Two-factor authentication

2. Enhanced security:
   - Rate limiting
   - Fraud detection
   - Session analytics

3. Performance:
   - Edge caching
   - Token optimization
   - Prefetching 