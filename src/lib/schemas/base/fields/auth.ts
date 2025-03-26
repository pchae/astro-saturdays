import { z } from "zod"
import { VALIDATION_RULES } from "../validation-rules"

/**
 * Creates an email validation schema
 * @description Validates email addresses with length and format requirements
 */
export const createEmailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email must be at least 5 characters")
  .max(255, "Email must be less than 255 characters")

/**
 * Creates a recovery email schema
 * @description Validates recovery email addresses for account security
 */
export const createRecoveryEmailSchema = createEmailSchema
  .describe("Recovery email address for account security")

/**
 * Creates a password validation schema
 * @description Validates passwords with length and complexity requirements
 */
export const createPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  )

/**
 * Creates a username validation schema
 * @description Validates usernames with length and character requirements
 */
export const createUsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes")

/**
 * Authentication-related schemas
 * @description Collection of schemas for authentication and user credentials
 */
export const authSchemas = {
  email: createEmailSchema,
  recoveryEmail: createRecoveryEmailSchema,
  password: createPasswordSchema,
  username: createUsernameSchema,
} as const

export type AuthSchemas = typeof authSchemas 