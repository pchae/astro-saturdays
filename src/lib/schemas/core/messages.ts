/**
 * Validation message templates
 */
export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required`,
  string: {
    min: (field: string, min: number) => `${field} must be at least ${min} characters`,
    max: (field: string, max: number) => `${field} must be at most ${max} characters`,
    email: (field: string = 'Email') => `${field} must be a valid email address`,
    url: (field: string = 'URL') => `${field} must be a valid URL`,
    matches: (field: string, pattern: string) => `${field} must match pattern: ${pattern}`
  },
  number: {
    min: (field: string, min: number) => `${field} must be at least ${min}`,
    max: (field: string, max: number) => `${field} must be at most ${max}`,
    integer: (field: string) => `${field} must be an integer`,
    positive: (field: string) => `${field} must be a positive number`
  },
  array: {
    min: (field: string, min: number) => `${field} must contain at least ${min} items`,
    max: (field: string, max: number) => `${field} must contain at most ${max} items`
  },
  date: {
    min: (field: string, min: string) => `${field} must be after ${min}`,
    max: (field: string, max: string) => `${field} must be before ${max}`,
    invalid: (field: string) => `${field} must be a valid date`
  },
  custom: {
    password: (field: string = 'Password') => 
      `${field} must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number`,
    phone: (field: string = 'Phone number') => 
      `${field} must be a valid phone number`,
    username: (field: string = 'Username') => 
      `${field} must contain only letters, numbers, and underscores`
  }
} as const;

/**
 * Type for validation message keys
 */
export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;

/**
 * Gets a validation message by key and parameters
 */
export function getValidationMessage(
  key: ValidationMessageKey,
  params: Record<string, string | number> = {}
): string {
  const message = VALIDATION_MESSAGES[key];
  if (typeof message === 'function') {
    return message(String(params.field));
  }
  return 'Invalid value';
} 