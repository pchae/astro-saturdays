import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import type { AllSettingsData } from '@/lib/api-client/settings';
import type { SettingsFormData } from '@/types/settings';
import type { ProfileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import { profileSettingsSchema } from '@/lib/database/schemas/settings/profile';
import type { SecuritySettingsSchema, PasswordSchema } from '@/lib/database/schemas/settings/security';
import { securitySettingsSchema, passwordSchema } from '@/lib/database/schemas/settings/security';
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

const defaultSecurityData: DeepPartial<SecuritySettingsSchema> = {
  password: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  twoFactor: {
    enabled: false,
    // method: 'email', // Default might come from schema
    // recoveryEmail: '' // Default might come from schema
  },
  // securityQuestions and sessionManagement might be handled separately or removed if not used
  // securityQuestions: {
  //   questions: []
  // },
  // sessionManagement: {
  //   rememberMe: true,
  //   sessionTimeout: 30,
  //   maxSessions: 1,
  //   allowMultipleSessions: false
  // }
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

// Security Form Hook (Refactored)
export function useSecurityForm(initialData?: Partial<SecuritySettingsSchema>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SecuritySettingsSchema>({
    defaultValues: {
      ...defaultSecurityData,
      ...initialData,
      password: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        ...(initialData?.password),
      },
      twoFactor: {
        enabled: initialData?.twoFactor?.enabled ?? false,
        method: initialData?.twoFactor?.method ?? 'email',
        phone: initialData?.twoFactor?.phone ?? '',
        recoveryEmail: initialData?.twoFactor?.recoveryEmail ?? '',
        backupCodes: initialData?.twoFactor?.backupCodes ?? [],
      },
      securityQuestions: {
        questions: initialData?.securityQuestions?.questions ?? [],
      },
      sessionManagement: {
        rememberMe: initialData?.sessionManagement?.rememberMe ?? true,
        sessionTimeout: initialData?.sessionManagement?.sessionTimeout ?? 30,
        maxSessions: initialData?.sessionManagement?.maxSessions ?? 1,
        allowMultipleSessions: initialData?.sessionManagement?.allowMultipleSessions ?? false,
      }
    } as SecuritySettingsSchema,
    mode: 'onChange',
  });

  const handleSecuritySubmit = async (formData: SecuritySettingsSchema) => {
    console.log("[useSecurityForm] handleSecuritySubmit entered.");

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    let updateOccurred = false;

    console.log("Security form submitted. Dirty fields:", form.formState.dirtyFields);
    console.log("Submitted Data:", formData);

    if (form.formState.dirtyFields.password?.currentPassword || 
        form.formState.dirtyFields.password?.newPassword || 
        form.formState.dirtyFields.password?.confirmPassword) 
    {
        updateOccurred = true;
        console.log("Password fields dirty, attempting validation and update...");
        
        const passwordValidation = passwordSchema.safeParse(formData.password);

        if (!passwordValidation.success) {
            console.error("Manual password validation failed:", passwordValidation.error.flatten());
            const fieldErrors = passwordValidation.error.flatten().fieldErrors;
            Object.entries(fieldErrors).forEach(([field, messages]) => {
                if (messages && messages.length > 0) {
                    form.setError(`password.${field as keyof PasswordSchema}`, {
                        type: 'manual',
                        message: messages[0],
                    });
                }
            });
            const generalErrorMsg = Object.values(fieldErrors).flat().join(" ");
            setError(generalErrorMsg || "Password validation failed.");
            setIsLoading(false);
            return;
        }

        const validatedPasswordData = passwordValidation.data;
        
        console.log("[useSecurityForm] Logging settingsApi object:");

        const result = await settingsApi.updatePassword(validatedPasswordData);
        console.log("Password update result:", result);

        if (!result.success) {
            console.error("Password update failed:", result.error);
            setError(result.error || 'Failed to update password.');
        } else {
            console.log("Password update successful.");
            setSuccessMessage("Password updated successfully.");
            form.resetField("password.currentPassword");
            form.resetField("password.newPassword");
            form.resetField("password.confirmPassword");
            form.reset({}, { keepValues: true, keepDirty: false, keepDefaultValues: false, keepErrors: false, keepTouched: false, keepIsSubmitSuccessful: true });
        }
    } else {
        console.log("Password fields not dirty, skipping update.");
    }

    if (form.formState.dirtyFields.twoFactor?.enabled) {
        updateOccurred = true;
        console.log("2FA enabled status changed, but API integration is pending.");
        setError("2FA changes cannot be saved yet.");
    }
    
    if (!updateOccurred) {
        setSuccessMessage("No changes detected.");
    }

    setIsLoading(false);
  };

  return {
    form,
    onSubmit: form.handleSubmit(handleSecuritySubmit),
    isLoading,
    error,
    successMessage,
  };
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
  const fetchSettings = async (): Promise<AllSettingsData | undefined> => {
    console.log('useSettings: Fetching settings...');
    const profileResult = await settingsApi.fetchProfile();

    if (!profileResult.success) {
      console.error("useSettings: Failed to fetch one or more settings sections:", profileResult.error);
      throw profileResult.error || new Error("Failed to fetch settings");
    }

    console.log('useSettings: Successfully fetched settings data.');
    const allData: AllSettingsData = {
        profile: profileResult.data ?? null,
        security: null,
        notifications: null
    }
    return allData;
  };

  return {
    fetchSettings,
  };
} 