import type {
  ProfileFormData,
  SecurityFormData,
  NotificationFormData,
  PrivacyFormData,
  AppearanceFormData,
} from '@/lib/schemas';

export enum NotificationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface ProfileSettings {
  name: string;
  email: string;
  bio?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: NotificationFrequency;
}

export interface PrivacySettings {
  isPublic: boolean;
  showEmail: boolean;
}

export interface SettingsFormData {
  profile?: Partial<ProfileFormData>;
  security?: Partial<SecurityFormData>;
  notifications?: Partial<NotificationFormData>;
  privacy?: Partial<PrivacyFormData>;
  appearance?: Partial<AppearanceFormData>;
}

export interface SettingsApiResponse {
  success: boolean;
  data?: SettingsFormData;
  error?: string;
} 