import { z } from 'zod';
import { NotificationFrequency } from '@/types/settings';

// Base schemas for reusable validation patterns
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .transform(val => val.trim())
  .optional()
  .or(z.literal(''));

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .transform(val => val.trim()),
  email: z
    .string()
    .email('Invalid email address')
    .transform(val => val.toLowerCase()),
  bio: z
    .string()
    .max(160, 'Bio must be less than 160 characters')
    .optional()
    .transform(val => val?.trim()),
  avatar: urlSchema,
  website: urlSchema,
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .transform(val => val?.trim()),
});

const notificationSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(false),
  frequency: z.nativeEnum(NotificationFrequency).default(NotificationFrequency.WEEKLY),
  digest: z.boolean().default(true),
  marketing: z.boolean().default(false),
  security: z.boolean().default(true),
  newsletter: z.boolean().default(false),
});

const privacySchema = z.object({
  isPublic: z.boolean().default(false),
  showEmail: z.boolean().default(false),
  showLocation: z.boolean().default(false),
  allowIndexing: z.boolean().default(true),
  allowDataCollection: z.boolean().default(true),
});

const securitySchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
  twoFactorEnabled: z.boolean().default(false),
  recoveryEmail: z
    .string()
    .email('Invalid recovery email address')
    .transform(val => val.toLowerCase())
    .optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  reducedMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
});

export const settingsFormSchema = z.object({
  profile: profileSchema,
  notifications: notificationSchema,
  privacy: privacySchema,
  security: securitySchema,
  appearance: appearanceSchema,
});

export type SettingsFormSchema = z.infer<typeof settingsFormSchema>;

// Individual section types for granular form handling
export type ProfileFormSchema = z.infer<typeof profileSchema>;
export type NotificationFormSchema = z.infer<typeof notificationSchema>;
export type PrivacyFormSchema = z.infer<typeof privacySchema>;
export type SecurityFormSchema = z.infer<typeof securitySchema>;
export type AppearanceFormSchema = z.infer<typeof appearanceSchema>;

// Partial schemas for patch updates
export const partialSettingsFormSchema = settingsFormSchema.partial();
export type PartialSettingsFormSchema = z.infer<typeof partialSettingsFormSchema>; 