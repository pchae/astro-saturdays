import type {
  ProfileFormData,
  SecuritySettings,
  NotificationSettings,
} from "@/lib/schemas/settings"

// Base settings interfaces
export type { ProfileFormData }
export type { SecuritySettings }
export type { NotificationSettings }

// Combined settings type
export interface UserSettings {
  profile: ProfileFormData;
  security: SecuritySettings;
  notifications: NotificationSettings;
  updatedAt?: string;
}

// API types
export interface SettingsUpdateData {
  profile?: Partial<ProfileFormData>;
  security?: Partial<SecuritySettings>;
  notifications?: Partial<NotificationSettings>;
}

export interface SettingsResponse {
  success: boolean;
  data?: UserSettings;
  error?: string;
}

// Form data types
export type SecurityFormData = SecuritySettings;
export type NotificationFormData = NotificationSettings;

export interface SettingsFormData {
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
} 