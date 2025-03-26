import { z } from "zod"
import { VALIDATION_RULES } from "../validation-rules"

/**
 * Creates a URL validation schema
 * @description Validates URLs with optional empty string support
 */
export const createUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .or(z.literal(""))
  .optional()

/**
 * Creates a phone number validation schema
 * @description Validates international phone numbers
 */
export const createPhoneSchema = z
  .string()
  .regex(
    VALIDATION_RULES.PHONE.REGEX,
    VALIDATION_RULES.PHONE.MESSAGE
  )
  .describe("Phone number in international format")

/**
 * Creates a language code validation schema
 * @description Validates supported language codes
 */
export const createLanguageSchema = z.enum(["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"], {
  description: "Supported language codes",
})

/**
 * Creates a visibility settings schema
 * @description Validates profile visibility options
 */
export const createVisibilitySchema = z.enum(["public", "private", "friends"], {
  description: "Profile visibility options",
})

/**
 * Profile-related schemas
 * @description Collection of schemas for user profile settings
 */
export const profileSchemas = {
  url: createUrlSchema,
  phone: createPhoneSchema,
  language: createLanguageSchema,
  visibility: createVisibilitySchema,
} as const

export type ProfileSchemas = typeof profileSchemas 