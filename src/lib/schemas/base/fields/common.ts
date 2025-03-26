import { z } from "zod"
import { VALIDATION_RULES } from "../validation-rules"

/**
 * Creates a date validation schema
 * @description Validates dates within acceptable range
 */
export const createDateSchema = z.coerce
  .date()
  .min(new Date("1900-01-01"), "Date must be after 1900")
  .max(new Date(), "Date cannot be in the future")

/**
 * Creates a theme validation schema
 * @description Validates supported theme options
 */
export const createThemeSchema = z.enum(["light", "dark", "system"], {
  description: "Available theme options",
})

/**
 * Creates a generic text field validation schema
 * @description Creates a text field schema with configurable length requirements
 */
export const createTextFieldSchema = (options?: { min?: number; max?: number }) =>
  z
    .string()
    .min(
      options?.min ?? VALIDATION_RULES.TEXT.MIN_LENGTH,
      `Text must be at least ${options?.min ?? VALIDATION_RULES.TEXT.MIN_LENGTH} characters`
    )
    .max(
      options?.max ?? VALIDATION_RULES.TEXT.MAX_LENGTH,
      `Text must be less than ${options?.max ?? VALIDATION_RULES.TEXT.MAX_LENGTH} characters`
    )

/**
 * Common field schemas
 * @description Collection of commonly used field validation schemas
 */
export const commonSchemas = {
  date: createDateSchema,
  theme: createThemeSchema,
  text: createTextFieldSchema,
} as const

export type CommonSchemas = typeof commonSchemas 