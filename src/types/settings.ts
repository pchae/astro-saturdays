import type {
  ProfileFormData,
} from '@/lib/schemas/settings/profile';
import type {
  SecurityFormData,
} from '@/lib/schemas/settings/security';
import type {
  NotificationFormData,
} from '@/lib/schemas/settings/notifications';
import type {
  PrivacyFormData,
} from '@/lib/schemas/settings/privacy';
import type {
  AppearanceFormData,
} from '@/lib/schemas/settings/appearance';

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
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
  privacy?: PrivacyFormData;
  appearance?: AppearanceFormData;
}

export interface SettingsApiResponse {
  success: boolean;
  data?: SettingsFormData;
  error?: string;
} 