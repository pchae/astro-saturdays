import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUser } from '@/lib/hooks/useUser';
import type { SettingsFormData } from '@/types/settings';
import { profileFormSchema, type ProfileFormData } from '@/lib/schemas/settings/profile';
import { securityFormSchema, type SecurityFormData } from '@/lib/schemas/settings/security';
import { notificationFormSchema, type NotificationFormData } from '@/lib/schemas/settings/notifications';
import { settingsApi } from '@/lib/api/client';

const defaultProfileData: ProfileFormData = {
  fullName: '',
  email: '',
  bio: '',
  avatarUrl: '',
};

const defaultSecurityData: SecurityFormData = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  twoFactorEnabled: false,
  sessionManagement: {
    rememberMe: true,
    sessionTimeout: 30,
    allowMultipleSessions: false,
  },
};

const defaultNotificationData: NotificationFormData = {
  preferences: {},
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
      if (!user?.id) throw new Error("User not found");
      await settingsApi.update({ profile: data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
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
      if (!user?.id) throw new Error("User not found");
      await settingsApi.update({ security: data });
      toast.success("Security settings updated successfully");
    } catch (error) {
      console.error("Failed to update security settings:", error);
      toast.error("Failed to update security settings");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}

// Notifications Form Hook
export function useNotificationsForm(initialData?: Partial<NotificationFormData>) {
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
      if (!user?.id) throw new Error("User not found");
      await settingsApi.update({ notifications: data });
      toast.success("Notification settings updated successfully");
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      toast.error("Failed to update notification settings");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}


// Combined Settings Form Hook
export function useSettingsForm(initialData?: Partial<SettingsFormData>) {
  const { user } = useUser();
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(z.object({
      profile: profileFormSchema,
      security: securityFormSchema,
      notifications: notificationFormSchema,
    })),
    defaultValues: {
      profile: { ...defaultProfileData, ...initialData?.profile },
      security: { ...defaultSecurityData, ...initialData?.security },
      notifications: { ...defaultNotificationData, ...initialData?.notifications },
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      if (!user?.id) throw new Error("User not found");
      await settingsApi.update(data);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
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