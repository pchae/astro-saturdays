import { z } from "zod"
import { VALIDATION_RULES } from "../validation-rules"

/**
 * Creates a session timeout validation schema
 * @description Validates session timeout duration in minutes
 */
export const createTimeoutSchema = z
  .number()
  .min(
    VALIDATION_RULES.SESSION.MIN_TIMEOUT,
    `Timeout must be at least ${VALIDATION_RULES.SESSION.MIN_TIMEOUT} minutes`
  )
  .max(
    VALIDATION_RULES.SESSION.MAX_TIMEOUT,
    `Timeout must be less than ${VALIDATION_RULES.SESSION.MAX_TIMEOUT} minutes`
  )
  .default(VALIDATION_RULES.SESSION.DEFAULT_TIMEOUT)
  .describe("Session timeout in minutes")

/**
 * Session-related schemas
 * @description Collection of schemas for session management
 */
export const sessionSchemas = {
  timeout: createTimeoutSchema,
} as const

export type SessionSchemas = typeof sessionSchemas 