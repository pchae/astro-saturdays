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
  // Profile settings
  fullName: string;
  email: string;
  bio: string;

  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;

  // Privacy settings
  isPublic: boolean;
  showEmail: boolean;
  showLocation: boolean;
  allowIndexing: boolean;
  dataCollection: boolean;

  // Security settings
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  twoFactorEnabled: boolean;
  recoveryEmail: string;

  // Appearance settings
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

export type SettingsApiResponse = {
  success: boolean;
  data?: SettingsFormData;
  error?: string;
}; 