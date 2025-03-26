/**
 * Field validation schemas
 * @description Re-exports all field validation schemas organized by domain
 */

export * from "./auth"
export * from "./profile"
export * from "./session"
export * from "./common"

import { authSchemas } from "./auth"
import { profileSchemas } from "./profile"
import { sessionSchemas } from "./session"
import { commonSchemas } from "./common"

/**
 * Combined field schemas
 * @description All field validation schemas grouped by domain
 */
export const fieldSchemas = {
  auth: authSchemas,
  profile: profileSchemas,
  session: sessionSchemas,
  common: commonSchemas,
} as const

export type FieldSchemas = typeof fieldSchemas 