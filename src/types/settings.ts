// Base settings interfaces
export interface ProfileSettings {
  fullName?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  updatedAt?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  recoveryEmail?: string;
  securityQuestions?: Array<{
    question: string;
    answer: string;
  }>;
  sessionManagement: {
    rememberMe: boolean;
    sessionTimeout: number;
    allowMultipleSessions: boolean;
  };
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  preferences: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
  };
}

// Combined settings type
export interface UserSettings {
  profile: ProfileSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  updatedAt?: string;
}

// API types
export interface SettingsUpdateData {
  profile?: Partial<ProfileSettings>;
  security?: Partial<SecuritySettings>;
  notifications?: Partial<NotificationSettings>;
}

export interface SettingsResponse {
  success: boolean;
  data?: UserSettings;
  error?: string;
}

// Form data types
export type ProfileFormData = ProfileSettings;
export type SecurityFormData = SecuritySettings;
export type NotificationFormData = NotificationSettings;

export interface SettingsFormData {
  profile?: ProfileFormData;
  security?: SecurityFormData;
  notifications?: NotificationFormData;
} 