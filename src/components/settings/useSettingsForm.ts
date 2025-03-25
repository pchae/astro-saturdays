import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUser } from '@/lib/hooks/useUser';
import type { SettingsFormData } from '@/types/settings';
import type { ProfileFormData } from '@/lib/schemas/settings/profile';
import { profileFormSchema } from '@/lib/schemas/settings/profile';
import type { SecurityFormData } from '@/lib/schemas/settings/security';
import { securityFormSchema } from '@/lib/schemas/settings/security';
import type { NotificationFormData } from '@/lib/schemas/settings/notifications';
import { notificationFormSchema } from '@/lib/schemas/settings/notifications';
import { settingsApi } from '@/lib/api/client';
import { updateProfile, updateSecurity, updateNotifications } from '@/lib/api/settings';

// Default form data
const defaultProfileData: ProfileFormData = {
  fullName: '',
  email: '',
  bio: '',
  avatarUrl: ''
};

const defaultSecurityData: SecurityFormData = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  twoFactorEnabled: false,
  sessionManagement: {
    rememberMe: true,
    sessionTimeout: 30,
    allowMultipleSessions: true
  }
};

const defaultNotificationData: NotificationFormData = {
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
    }
  }
};

// Profile Form Hook
export function useProfileForm(initialData?: Partial<ProfileFormData>) {
  const { user } = useUser();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...defaultProfileData,
      ...initialData,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile('current-user', data);
      return { success: true };
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
export function useSecurityForm(initialData?: Partial<SecurityFormData>) {
  const { user } = useUser();
  const form = useForm<SecurityFormData>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      ...defaultSecurityData,
      ...initialData,
    },
  });

  const onSubmit = async (data: SecurityFormData) => {
    try {
      await updateSecurity('current-user', data);
      return { success: true };
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
export function useNotificationForm(initialData?: Partial<NotificationFormData>) {
  const { user } = useUser();
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      ...defaultNotificationData,
      ...initialData,
    },
  });

  const onSubmit = async (data: NotificationFormData) => {
    try {
      await updateNotifications('current-user', data);
      return { success: true };
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