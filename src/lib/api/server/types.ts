/**
 * Generic API response type
 */
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generic API error type
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Generic API handler context
 */
export interface ApiContext {
  userId?: string;
  isAuthenticated: boolean;
} 