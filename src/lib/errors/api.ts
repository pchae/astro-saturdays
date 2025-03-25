import { AppError } from './base';

export class ApiError extends AppError {
  constructor(message: string, code: string, status: number = 400) {
    super(message, code, status);
    this.name = 'ApiError';
  }
}

export const ApiErrors = {
  badRequest: (message: string = 'Invalid request') => new ApiError(
    message,
    'API_BAD_REQUEST',
    400
  ),
  
  notFound: (resource: string) => new ApiError(
    `${resource} not found`,
    'API_NOT_FOUND',
    404
  ),
  
  validation: (message: string) => new ApiError(
    message,
    'API_VALIDATION_ERROR',
    400
  ),
  
  internal: () => new ApiError(
    'Internal server error',
    'API_INTERNAL_ERROR',
    500
  )
} as const; 