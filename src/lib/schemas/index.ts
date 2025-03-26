// Base schemas and utilities
export * from "./base/common"
export * from "./base/validation"

// Profile schemas and types
export * from "./settings/profile"

// Security schemas and types
export * from "./settings/security"

// Notification schemas and types
export * from "./settings/notifications"

// Combined types for settings
import type { ProfileFormData } from "./settings/profile"
import type { SecuritySettingsData } from "./settings/security"
import type { NotificationSettings } from "./settings/notifications"

/**
 * Combined type for all user settings
 */
export type UserSettings = {
  profile: ProfileFormData
  security: SecuritySettingsData
  notifications: NotificationSettings
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