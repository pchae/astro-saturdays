/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Authentication error class
 */
export class AuthError extends ApiError {
  constructor(message: string, code: string, status: number = 401) {
    super(message, code, status);
    this.name = 'AuthError';
  }
}

/**
 * Session error
 */
export class SessionError extends AuthError {
  constructor(message = 'Invalid or expired session') {
    super(message, 'AUTH_SESSION_ERROR', 401);
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized access') {
    super(message, 'AUTH_UNAUTHORIZED', 401);
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AuthError {
  constructor(message = 'Access forbidden') {
    super(message, 'AUTH_FORBIDDEN', 403);
  }
}

/**
 * Common auth errors
 */
export const AuthErrors = {
  unauthorized: () => new UnauthorizedError(),
  forbidden: () => new ForbiddenError(),
  sessionExpired: () => new SessionError(),
  invalidCredentials: () => new AuthError('Invalid credentials', 'AUTH_INVALID_CREDENTIALS'),
} as const; 