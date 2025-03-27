/**
 * Generic API response type
 */
export interface ApiResponse<T = unknown> {
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

/**
 * API endpoint handler type
 */
export type ApiHandler<T = unknown> = (
  context: ApiContext
) => Promise<ApiResponse<T>>;

/**
 * API route configuration
 */
export interface ApiRouteConfig {
  /** Whether authentication is required */
  requireAuth?: boolean;
  /** Allowed HTTP methods */
  methods?: string[];
  /** Custom error handler */
  onError?: (error: Error) => ApiResponse;
} 