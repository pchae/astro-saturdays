import { z } from 'zod';

// Profile Form Schema
export const profileFormSchema = z.object({
  // Basic Information
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),

  // Professional Information
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url().optional(),
  location: z.string().optional(),

  // Preferences
  timezone: z.string(),
  language: z.string(),
  dateFormat: z.string(),
  timeFormat: z.enum(['12h', '24h']),
});

// Security Form Schema
export const securityFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Notifications Form Schema
export const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
});

// Privacy Form Schema
export const privacyFormSchema = z.object({
  isPublic: z.boolean(),
  showEmail: z.boolean(),
  allowMessaging: z.boolean(),
});

// Appearance Form Schema
export const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['small', 'medium', 'large']),
  reducedMotion: z.boolean(),
});

// Export types
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type SecurityFormData = z.infer<typeof securityFormSchema>;
export type NotificationFormData = z.infer<typeof notificationFormSchema>;
export type PrivacyFormData = z.infer<typeof privacyFormSchema>;
export type AppearanceFormData = z.infer<typeof appearanceFormSchema>; 