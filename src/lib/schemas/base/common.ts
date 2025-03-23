import { z } from "zod"

// Email validation with custom error message
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email must be at least 5 characters")
  .max(255, "Email must be less than 255 characters")

// Password validation with requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  )

// Username validation
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes")

// URL validation
export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .or(z.literal(""))
  .optional()

// Date validation
export const dateSchema = z.coerce
  .date()
  .min(new Date("1900-01-01"), "Date must be after 1900")
  .max(new Date(), "Date cannot be in the future")

// Language code validation
export const languageSchema = z.enum(["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"], {
  description: "Supported language codes",
})

// Theme validation
export const themeSchema = z.enum(["light", "dark", "system"], {
  description: "Available theme options",
})

// Visibility settings
export const visibilitySchema = z.enum(["public", "private", "friends"], {
  description: "Profile visibility options",
})

// Generic text field with length validation
export const textFieldSchema = (options?: { min?: number; max?: number }) =>
  z
    .string()
    .min(options?.min ?? 0, `Text must be at least ${options?.min ?? 0} characters`)
    .max(options?.max ?? 500, `Text must be less than ${options?.max ?? 500} characters`) 