import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/lib/hooks/useUser';
import type { AllSettingsData } from '@/lib/api-client/settings';
import type { SettingsFormData } from '@/types/settings';
import type { ProfileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import { profileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import type { SecuritySettingsSchema } from '@/lib/database/schemas/settings/security';
import { securitySettingsSchema } from '@/lib/database/schemas/settings/security';
import type { NotificationSettingsSchema } from '@/lib/database/schemas/settings/notifications';
import { notificationSettingsSchema } from '@/lib/database/schemas/settings/notifications';
import { settingsApi } from '@/lib/api-client/settings';
import type { DeepPartial } from '../../types/utils';

// Generic settings section form hook types
interface UseSettingsSectionFormArgs<T extends z.ZodType> {
  schema: T;
  defaultValues: DeepPartial<z.infer<T>>;
  updateFunction: (data: z.infer<T>) => Promise<{ success: boolean; data?: DeepPartial<z.infer<T>>; error?: any }>;
  initialData?: DeepPartial<z.infer<T>>;
}

// Generic settings section form hook
export function useSettingsSectionForm<T extends z.ZodType>({
  schema,
  defaultValues,
  updateFunction,
  initialData,
}: UseSettingsSectionFormArgs<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
    } as z.infer<T>,
  });

  const onSubmit = async (formData: z.infer<T>) => {
    console.log("Submitting settings data:", formData);
    try {
      const response = await updateFunction(formData);
      console.log("Update response received:", response);

      if (response.success && response.data) {
        console.log("Update successful. Resetting form with new data:", response.data);
        try {
          // Reset form with the latest data returned from the API
          form.reset(response.data as z.infer<T>);
          console.log("Form reset completed.");
        } catch (resetError) {
          console.error("Error resetting form after successful update:", resetError);
          // Optionally: show a notification to the user that UI update failed but data was saved
        }
      } else if (!response.success) {
        console.error("Update failed:", response.error);
        // Optionally: Add more specific error handling/display based on response.error
        // form.setError('root.serverError', { message: 'Failed to save settings' });
      }

      // Return the response for potential further handling if needed
      return response;
    } catch (error) {
      console.error('Unexpected error during settings update:', error);
      // form.setError('root.serverError', { message: 'An unexpected error occurred' });
      return { success: false, error };
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}

// Default form data (Updated: Removed preferences)
const defaultProfileData: ProfileSettingsSchema = {
  personal: {
    firstName: '',
    lastName: '',
    phoneNumber: ''
  },
  professional: {
    companyName: '',
    companyPosition: ''
  },
  // preferences: { // Removed
  //   language: 'en',
  //   timezone: 'UTC'
  // }
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
  return useSettingsSectionForm({
    schema: profileSettingsSchema.row,
    defaultValues: defaultProfileData,
    updateFunction: settingsApi.updateProfile,
    initialData: initialData as DeepPartial<ProfileSettingsSchema>,
  });
}

// Security Form Hook
export function useSecurityForm(initialData?: Partial<SecuritySettingsSchema>) {
  return useSettingsSectionForm({
    schema: securitySettingsSchema.row,
    defaultValues: defaultSecurityData,
    updateFunction: settingsApi.updateSecurity,
    initialData: initialData as DeepPartial<SecuritySettingsSchema>,
  });
}

// Notification Form Hook
export function useNotificationForm(initialData?: Partial<NotificationSettingsSchema>) {
  return useSettingsSectionForm({
    schema: notificationSettingsSchema.row,
    defaultValues: defaultNotificationData,
    updateFunction: settingsApi.updateNotifications,
    initialData: initialData as DeepPartial<NotificationSettingsSchema>,
  });
}

// Hook to fetch all settings
export function useSettings() {
  const { user } = useUser();

  const fetchSettings = async (): Promise<AllSettingsData | undefined> => {
    console.log('useSettings: Calling settingsApi.fetchAll...');
    const result = await settingsApi.fetchAll();

    if (!result.success) {
      console.error("useSettings: Failed to fetch settings:", result.error);
      throw result.error || new Error("Failed to fetch settings");
    }

    console.log('useSettings: Successfully fetched settings data.');
    return result.data;
  };

  return {
    fetchSettings,
  };
} 