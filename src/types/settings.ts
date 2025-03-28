import type {
  ProfileSettingsSchema as ProfileFormData,
} from "@/lib/database/schemas/settings/profile";
import type {
  SecuritySettingsSchema as SecuritySettings,
} from "@/lib/database/schemas/settings/security";
import type {
  NotificationSettingsSchema as NotificationSettings,
} from "@/lib/database/schemas/settings/notifications";

// Base settings interfaces
export type { ProfileFormData }
export type { SecuritySettings }
export type { NotificationSettings }

// Combined settings type
export interface UserSettings {
  profile: ProfileFormData | null;
  security: SecuritySettings | null;
  notifications: NotificationSettings | null;
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