// Core exports
export * from './core/types';
export * from './core/validators';
export * from './core/messages';

// Utility exports
export * from './utils/factories';

// Feature schema exports
export * as authSchemas from './features/auth';

// Base schemas and validation
export * from "./base/fields"
export * from "./base/validation-rules"

// Combined types for settings
import type { ProfileSettingsSchema } from "@/lib/database/schemas/settings/profile"
import type { SecuritySettingsSchema } from "@/lib/database/schemas/settings/security"
import type { NotificationSettingsSchema } from "@/lib/database/schemas/settings/notifications"

/**
 * Combined type for all user settings
 */
export type UserSettings = {
  profile: ProfileSettingsSchema
  security: SecuritySettingsSchema
  notifications: NotificationSettingsSchema
}

/**
 * Type for settings section identifiers
 */
export type SettingsSection = keyof UserSettings

/**
 * Type for form validation errors
 */
export type ValidationError = {
  path: string[]
  message: string
} 