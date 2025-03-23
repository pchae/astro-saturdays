// Base schemas
export * from "./base/common"
export * from "./base/validation"

// Settings schemas
export * from "./settings/profile"
export * from "./settings/security"
export * from "./settings/notifications"
export * from "./settings/privacy"
export * from "./settings/appearance"

// Re-export commonly used types
import type { ProfileFormData } from "./settings/profile"
import type { SecurityFormData, PasswordChangeData, TwoFactorSettingsData } from "./settings/security"
import type { NotificationFormData, CategoryUpdateData, GlobalSettingsData as NotificationGlobalSettings } from "./settings/notifications"
import type { PrivacyFormData, VisibilitySettingsData, DataSharingData, CookiePreferencesData } from "./settings/privacy"
import type { AppearanceFormData, AccessibilityData, LayoutData, DateTimeFormatData } from "./settings/appearance"

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
  PrivacyFormData,
  VisibilitySettingsData,
  DataSharingData,
  CookiePreferencesData,
  
  // Appearance types
  AppearanceFormData,
  AccessibilityData,
  LayoutData,
  DateTimeFormatData,
}

// Combined settings type for the entire settings page
export type UserSettings = {
  profile: ProfileFormData
  security: SecurityFormData
  notifications: NotificationFormData
  privacy: PrivacyFormData
  appearance: AppearanceFormData
} 