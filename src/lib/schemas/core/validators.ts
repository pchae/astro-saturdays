import { z } from 'zod';
import type { ValidationResult } from './types';

/**
 * Common validation patterns
 */
export const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
} as const;

/**
 * Common validation functions
 */
export const validators = {
  /**
   * Creates a string validator with common options
   */
  string: (options?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  }) => {
    let schema = z.string();
    
    if (options?.min) {
      schema = schema.min(options.min, options.message);
    }
    if (options?.max) {
      schema = schema.max(options.max, options.message);
    }
    if (options?.pattern) {
      schema = schema.regex(options.pattern, options.message);
    }
    
    return schema;
  },

  /**
   * Creates an email validator
   */
  email: () => validators.string({
    pattern: patterns.email,
    message: 'Invalid email address'
  }),

  /**
   * Creates a password validator
   */
  password: (options?: { min?: number; max?: number }) => validators.string({
    min: options?.min ?? 8,
    max: options?.max ?? 100,
    pattern: patterns.password,
    message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
  }),

  /**
   * Creates a URL validator
   */
  url: () => validators.string({
    pattern: patterns.url,
    message: 'Invalid URL'
  })
};

/**
 * Validates data against a schema and returns a ValidationResult
 */
export async function validate<T>(
  schema: z.ZodType<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  try {
    const validData = await schema.parseAsync(data);
    return {
      success: true,
      data: validData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.map(p => String(p)),
          message: err.message
        }))
      };
    }
    throw error;
  }
} 