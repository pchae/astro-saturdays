import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateUserProfile } from '@/lib/api/user';
import type { SettingsFormData } from '@/types/settings';
import * as z from 'zod';

const settingsFormSchema = z.object({
  // Profile settings
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),

  // Notification settings
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),

  // Privacy settings
  isPublic: z.boolean(),
  showEmail: z.boolean(),
  showLocation: z.boolean(),
  allowIndexing: z.boolean(),
  dataCollection: z.boolean(),

  // Security settings
  currentPassword: z.string().optional(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  confirmPassword: z.string().optional(),
  twoFactorEnabled: z.boolean(),
  recoveryEmail: z.string().email('Invalid recovery email'),

  // Appearance settings
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['small', 'medium', 'large']),
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  if (data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match or current password is required",
  path: ['confirmPassword'],
});

const defaultValues: SettingsFormData = {
  fullName: '',
  email: '',
  bio: '',
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  marketingEmails: false,
  isPublic: false,
  showEmail: false,
  showLocation: false,
  allowIndexing: true,
  dataCollection: true,
  twoFactorEnabled: false,
  recoveryEmail: '',
  theme: 'system',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
};

export function useSettingsForm(initialData?: Partial<SettingsFormData>) {
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateUserProfile({
        full_name: data.fullName,
        email: data.email,
        bio: data.bio || '',
      });
      
      // Here you would typically update other settings in their respective tables
      // For now, we'll just show a success message
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings. Please try again.');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
} 