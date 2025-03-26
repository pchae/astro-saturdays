/**
 * Validation rules used across schema definitions
 * @description Centralized rules for validation constraints and messages
 */
export const VALIDATION_RULES = {
  PHONE: {
    /** Regular expression for international phone number validation */
    REGEX: /^\+?[1-9]\d{1,14}$/,
    /** Error message for invalid phone numbers */
    MESSAGE: "Invalid phone number format",
  },
  SESSION: {
    /** Minimum session timeout in minutes */
    MIN_TIMEOUT: 5,
    /** Maximum session timeout in minutes */
    MAX_TIMEOUT: 60,
    /** Default session timeout in minutes */
    DEFAULT_TIMEOUT: 30,
    /** Maximum number of concurrent sessions allowed */
    MAX_CONCURRENT: 10,
  },
  SECURITY: {
    /** Minimum number of security questions required */
    MIN_QUESTIONS: 2,
    /** Maximum number of security questions allowed */
    MAX_QUESTIONS: 3,
  },
  TEXT: {
    /** Default minimum length for text fields */
    MIN_LENGTH: 1,
    /** Default maximum length for text fields */
    MAX_LENGTH: 500,
  },
} as const

/**
 * Type definition for validation rules
 */
export type ValidationRules = typeof VALIDATION_RULES 