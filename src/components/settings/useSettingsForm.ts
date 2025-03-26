import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/lib/hooks/useUser';
import type { SettingsFormData } from '@/types/settings';
import type { ProfileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import { profileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import type { SecuritySettingsSchema } from '@/lib/database/schemas/settings/security';
import { securitySettingsSchema } from '@/lib/database/schemas/settings/security';
import type { NotificationSettingsSchema } from '@/lib/database/schemas/settings/notifications';
import { notificationSettingsSchema } from '@/lib/database/schemas/settings/notifications';
import { settingsApi } from '@/lib/api/client/settings';

// Default form data
const defaultProfileData: ProfileSettingsSchema = {
  personal: {
    fullName: '',
    email: '',
    bio: '',
    avatarUrl: '',
    username: ''
  },
  professional: {
    jobTitle: '',
    company: '',
    website: '',
    location: ''
  },
  preferences: {
    language: 'en',
    timezone: 'UTC'
  }
};

const defaultSecurityData: SecuritySettingsSchema = {
  password: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  twoFactor: {
    enabled: false,
    method: 'email',
    recoveryEmail: ''
  },
  securityQuestions: {
    questions: []
  },
  sessionManagement: {
    rememberMe: true,
    sessionTimeout: 30,
    maxSessions: 1,
    allowMultipleSessions: false
  }
};

const defaultNotificationData: NotificationSettingsSchema = {
  preferences: {
    preferences: {
      security: {
        enabled: true,
        channels: ['email'],
        frequency: 'immediately'
      },
      account: {
        enabled: true,
        channels: ['email'],
        frequency: 'immediately'
      },
      updates: {
        enabled: true,
        channels: ['email'],
        frequency: 'weekly'
      },
      marketing: {
        enabled: false,
        channels: ['email'],
        frequency: 'never'
      },
      social: {
        enabled: true,
        channels: ['in_app', 'email'],
        frequency: 'daily'
      },
      system: {
        enabled: true,
        channels: ['email'],
        frequency: 'immediately'
      }
    }
  },
  schedule: {
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    },
    timezone: 'UTC'
  },
  frequency: {
    maxPerHour: 20,
    maxPerDay: 100,
    digestEmail: {
      enabled: true,
      frequency: 'daily',
      time: '09:00'
    }
  }
};

// Profile Form Hook
export function useProfileForm(initialData?: Partial<ProfileSettingsSchema>) {
  const { user } = useUser();
  const form = useForm<ProfileSettingsSchema>({
    resolver: zodResolver(profileSettingsSchema.row),
    defaultValues: {
      ...defaultProfileData,
      ...initialData,
    },
  });

  const onSubmit = async (data: ProfileSettingsSchema) => {
    try {
      const response = await settingsApi.update({ profile: data });
      return { success: response.success };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { success: false, error };
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}

// Security Form Hook
export function useSecurityForm(initialData?: Partial<SecuritySettingsSchema>) {
  const { user } = useUser();
  const form = useForm<SecuritySettingsSchema>({
    resolver: zodResolver(securitySettingsSchema.row),
    defaultValues: {
      ...defaultSecurityData,
      ...initialData,
    },
  });

  const onSubmit = async (data: SecuritySettingsSchema) => {
    try {
      const response = await settingsApi.update({ security: data });
      return { success: response.success };
    } catch (error) {
      console.error('Failed to update security settings:', error);
      return { success: false, error };
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}

// Notification Form Hook
export function useNotificationForm(initialData?: Partial<NotificationSettingsSchema>) {
  const { user } = useUser();
  const form = useForm<NotificationSettingsSchema>({
    resolver: zodResolver(notificationSettingsSchema.row),
    defaultValues: {
      ...defaultNotificationData,
      ...initialData,
    },
  });

  const onSubmit = async (data: NotificationSettingsSchema) => {
    try {
      const response = await settingsApi.update({ notifications: data });
      return { success: response.success };
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      return { success: false, error };
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}

// Combined Settings Form Hook
export function useSettingsForm() {
  const profileForm = useProfileForm();
  const securityForm = useSecurityForm();
  const notificationForm = useNotificationForm();

  return {
    profileForm,
    securityForm,
    notificationForm
  };
}

// Hook to fetch all settings
export function useSettings() {
  const { user } = useUser();

  const fetchSettings = async () => {
    if (!user?.id) throw new Error("User not found");
    return await settingsApi.fetch();
  };

  return {
    fetchSettings,
  };
} 