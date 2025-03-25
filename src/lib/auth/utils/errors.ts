export class AuthError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.status = status;
  }
}

export const AuthErrors = {
  unauthorized: () => new AuthError(
    'Authentication required',
    'AUTH_UNAUTHORIZED',
    401
  ),
  
  forbidden: () => new AuthError(
    'Insufficient permissions',
    'AUTH_FORBIDDEN',
    403
  ),
  
  invalidToken: () => new AuthError(
    'Invalid or expired token',
    'AUTH_INVALID_TOKEN',
    401
  ),
  
  sessionExpired: () => new AuthError(
    'Session has expired',
    'AUTH_SESSION_EXPIRED',
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