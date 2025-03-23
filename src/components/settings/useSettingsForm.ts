import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useUser } from '@/lib/hooks/useUser';
import {
  profileFormSchema,
  securityFormSchema,
  notificationFormSchema,
  privacyFormSchema,
  appearanceFormSchema,
  type ProfileFormData,
  type SecurityFormData,
  type NotificationFormData,
  type PrivacyFormData,
  type AppearanceFormData,
} from '@/lib/schemas';
import {
  updateProfile,
  updateSecurity,
  updateNotifications,
  updatePrivacy,
  updateAppearance,
  fetchUserSettings,
} from '@/lib/api/settings';
import { settingsApi } from '@/lib/api/client';

// Profile Form Hook
export function useProfileForm(initialData?: Partial<ProfileFormData>) {
  const { user } = useUser();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
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
      ...initialData,
    },
  });

  const onSubmit = async (data: NotificationFormData) => {
    try {
      if (!user?.id) throw new Error("User not found");
      await settingsApi.update({ notifications: data });
      toast.success("Notification preferences updated successfully");
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
      toast.error("Failed to update notification preferences");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}

// Privacy Form Hook
export function usePrivacyForm(initialData?: Partial<PrivacyFormData>) {
  const { user } = useUser();
  const form = useForm<PrivacyFormData>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      ...initialData,
    },
  });

  const onSubmit = async (data: PrivacyFormData) => {
    try {
      if (!user?.id) throw new Error("User not found");
      await settingsApi.update({ privacy: data });
      toast.success("Privacy settings updated successfully");
    } catch (error) {
      console.error("Failed to update privacy settings:", error);
      toast.error("Failed to update privacy settings");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}

// Appearance Form Hook
export function useAppearanceForm(initialData?: Partial<AppearanceFormData>) {
  const { user } = useUser();
  const form = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      ...initialData,
    },
  });

  const onSubmit = async (data: AppearanceFormData) => {
    try {
      if (!user?.id) throw new Error("User not found");
      await settingsApi.update({ appearance: data });
      toast.success("Appearance settings updated successfully");
    } catch (error) {
      console.error("Failed to update appearance settings:", error);
      toast.error("Failed to update appearance settings");
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