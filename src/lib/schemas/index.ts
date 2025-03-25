// Base schemas
export * from "./base/common"
export * from "./base/validation"

// Settings schemas
export * from "./settings/profile"
export * from "./settings/security"
export * from "./settings/notifications"

// Re-export commonly used types
import type { ProfileFormData } from "./settings/profile"
import type { SecurityFormData, PasswordChangeData, TwoFactorSettingsData } from "./settings/security"
import type { NotificationFormData, CategoryUpdateData, GlobalSettingsData as NotificationGlobalSettings } from "./settings/notifications"

export type {
  // Profile types
  ProfileFormData,
  
  // Security types
  SecurityFormData,
  PasswordChangeData,
  TwoFactorSettingsData,
  
  // Notification types
  NotificationFormData,
  CategoryUpdateData,
  NotificationGlobalSettings,
  
  // Privacy types
}

// Combined settings type for the entire settings page
export type UserSettings = {
  profile: ProfileFormData
  security: SecurityFormData
  notifications: NotificationFormData
} 