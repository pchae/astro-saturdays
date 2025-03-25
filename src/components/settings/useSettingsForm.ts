import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUser } from '@/lib/hooks/useUser';
import type { SettingsFormData } from '@/types/settings';
import { profileFormSchema, type ProfileFormData } from '@/lib/schemas/settings/profile';
import { securityFormSchema, type SecurityFormData } from '@/lib/schemas/settings/security';
import { notificationFormSchema, type NotificationFormData } from '@/lib/schemas/settings/notifications';
import { privacyFormSchema, type PrivacyFormData } from '@/lib/schemas/settings/privacy';
import { appearanceFormSchema, type AppearanceFormData } from '@/lib/schemas/settings/appearance';
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
  globalSettings: {
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      timezone: 'UTC',
    },
    pauseAll: false,
    digestEmail: {
      enabled: true,
      frequency: 'daily',
      time: '09:00',
    },
  },
};

const defaultPrivacyData: PrivacyFormData = {
  profileVisibility: 'public',
  activityVisibility: {
    likes: 'public',
    comments: 'public',
    followers: 'public',
    following: 'public',
  },
  dataSharing: {
    allowDataCollection: true,
    dataUsageLevel: 'functional',
    shareWithPartners: false,
    personalizedAds: false,
  },
  contentPreferences: {
    showSensitiveContent: false,
    contentFilters: [],
    ageRestriction: true,
  },
  searchVisibility: {
    allowProfileInSearch: true,
    allowEmailSearch: false,
    allowPhoneSearch: false,
  },
  blockList: [],
  cookiePreferences: {
    functional: true,
    essential: true,
    analytics: false,
    advertising: false,
    thirdParty: false,
  },
};

const defaultAppearanceData: AppearanceFormData = {
  layout: {
    density: 'comfortable',
    sidebarPosition: 'left',
    showAvatars: true,
    enableAnimations: true,
  },
  theme: 'system',
  language: 'en',
  accessibility: {
    colorScheme: 'default',
    reduceMotion: false,
    highContrast: false,
    fontSize: 'base',
  },
  dateTimeFormat: {
    timeZone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    firstDayOfWeek: 'monday',
  },
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

// Privacy Form Hook
export function usePrivacyForm(initialData?: Partial<PrivacyFormData>) {
  const { user } = useUser();
  const form = useForm<PrivacyFormData>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      ...defaultPrivacyData,
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
      ...defaultAppearanceData,
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

// Combined Settings Form Hook
export function useSettingsForm(initialData?: Partial<SettingsFormData>) {
  const { user } = useUser();
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(z.object({
      profile: profileFormSchema,
      security: securityFormSchema,
      notifications: notificationFormSchema,
      privacy: privacyFormSchema,
      appearance: appearanceFormSchema,
    })),
    defaultValues: {
      profile: { ...defaultProfileData, ...initialData?.profile },
      security: { ...defaultSecurityData, ...initialData?.security },
      notifications: { ...defaultNotificationData, ...initialData?.notifications },
      privacy: { ...defaultPrivacyData, ...initialData?.privacy },
      appearance: { ...defaultAppearanceData, ...initialData?.appearance },
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