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