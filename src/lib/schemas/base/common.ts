import { z } from "zod"
import { VALIDATION_CONSTANTS } from "./constants"

/**
 * Email validation schema with custom error messages
 * @description Validates email addresses with length and format requirements
 */
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email must be at least 5 characters")
  .max(255, "Email must be less than 255 characters")

/**
 * Recovery email schema extending base email schema
 * @description Validates recovery email addresses for account security
 */
export const recoveryEmailSchema = emailSchema
  .describe("Recovery email address for account security")

/**
 * Password validation schema with security requirements
 * @description Validates passwords with length and complexity requirements
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  )

/**
 * Username validation schema
 * @description Validates usernames with length and character requirements
 */
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes")

/**
 * URL validation schema
 * @description Validates URLs with optional empty string support
 */
export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .or(z.literal(""))
  .optional()

/**
 * Phone number validation schema
 * @description Validates international phone numbers
 */
export const phoneSchema = z
  .string()
  .regex(
    VALIDATION_CONSTANTS.PHONE.REGEX,
    VALIDATION_CONSTANTS.PHONE.MESSAGE
  )
  .describe("Phone number in international format")

/**
 * Session timeout validation schema
 * @description Validates session timeout duration in minutes
 */
export const timeoutSchema = z
  .number()
  .min(
    VALIDATION_CONSTANTS.SESSION.MIN_TIMEOUT,
    `Timeout must be at least ${VALIDATION_CONSTANTS.SESSION.MIN_TIMEOUT} minutes`
  )
  .max(
    VALIDATION_CONSTANTS.SESSION.MAX_TIMEOUT,
    `Timeout must be less than ${VALIDATION_CONSTANTS.SESSION.MAX_TIMEOUT} minutes`
  )
  .default(VALIDATION_CONSTANTS.SESSION.DEFAULT_TIMEOUT)
  .describe("Session timeout in minutes")

/**
 * Date validation schema
 * @description Validates dates within acceptable range
 */
export const dateSchema = z.coerce
  .date()
  .min(new Date("1900-01-01"), "Date must be after 1900")
  .max(new Date(), "Date cannot be in the future")

/**
 * Language code validation schema
 * @description Validates supported language codes
 */
export const languageSchema = z.enum(["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"], {
  description: "Supported language codes",
})

/**
 * Theme validation schema
 * @description Validates supported theme options
 */
export const themeSchema = z.enum(["light", "dark", "system"], {
  description: "Available theme options",
})

/**
 * Visibility settings schema
 * @description Validates profile visibility options
 */
export const visibilitySchema = z.enum(["public", "private", "friends"], {
  description: "Profile visibility options",
})

/**
 * Generic text field validation schema
 * @description Creates a text field schema with configurable length requirements
 */
export const textFieldSchema = (options?: { min?: number; max?: number }) =>
  z
    .string()
    .min(
      options?.min ?? VALIDATION_CONSTANTS.TEXT.MIN_LENGTH,
      `Text must be at least ${options?.min ?? VALIDATION_CONSTANTS.TEXT.MIN_LENGTH} characters`
    )
    .max(
      options?.max ?? VALIDATION_CONSTANTS.TEXT.MAX_LENGTH,
      `Text must be less than ${options?.max ?? VALIDATION_CONSTANTS.TEXT.MAX_LENGTH} characters`
    ) 