import { AppError } from './base';

export class AuthError extends AppError {
  constructor(message: string, code: string, status: number = 401) {
    super(message, code, status);
    this.name = 'AuthError';
  }
}

export class SessionError extends AuthError {
  constructor(message = 'Invalid or expired session') {
    super(message, 'AUTH_SESSION_ERROR', 401);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized access') {
    super(message, 'AUTH_UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = 'Access forbidden') {
    super(message, 'AUTH_FORBIDDEN', 403);
  }
}

export const AuthErrors = {
  unauthorized: () => new UnauthorizedError(),
  forbidden: () => new ForbiddenError(),
  sessionExpired: () => new SessionError(),
  
  invalidToken: () => new AuthError(
    'Invalid or expired token',
    'AUTH_INVALID_TOKEN',
    401
  ),
  
  invalidCredentials: () => new AuthError(
    'Invalid email or password',
    'AUTH_INVALID_CREDENTIALS',
    401
  ),
  
  emailNotVerified: () => new AuthError(
    'Email not verified',
    'AUTH_EMAIL_NOT_VERIFIED',
    403
  )
} as const; 