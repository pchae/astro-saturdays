import type {
  ProfileFormData,
  SecurityFormData,
  NotificationFormData
} from '@/lib/schemas/settings';

export interface UserSettings {
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
  updatedAt?: string;
}

export interface ProfileSettings {
  name: string;
  email: string;
  bio?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
}

export interface SettingsFormData {
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
}

export interface SettingsApiResponse {
  success: boolean;
  data?: SettingsFormData;
  error?: string;
} 