// Base schemas and utilities
export * from "./base/common"
export * from "./base/validation"

// Profile schemas and types
export * from "./forms/profile/schema"
export * from "./forms/profile/types"

// Security schemas and types
export * from "./security"

// Notification schemas and types
export * from "./forms/notifications/schema"
export * from "./forms/notifications/types"

// Combined types for settings
import type { ProfileFormData } from "./forms/profile/types"
import type { SecuritySettingsData } from "./security"
import type { NotificationSettings } from "./forms/notifications/types"

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