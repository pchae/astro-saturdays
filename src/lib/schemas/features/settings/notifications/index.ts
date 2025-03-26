import { z } from 'zod';
import { createSchemaSet, createStringField, createNumberField } from '../../../utils/factories';

/**
 * Available notification channels
 */
export const notificationChannels = ['email', 'push', 'in_app', 'sms'] as const;
export type NotificationChannel = typeof notificationChannels[number];

/**
 * Available notification categories
 */
export const notificationCategories = [
  'security',
  'account',
  'updates',
  'marketing',
  'social',
  'system'
] as const;
export type NotificationCategory = typeof notificationCategories[number];

/**
 * Available notification frequencies
 */
export const notificationFrequencies = [
  'immediately',
  'daily',
  'weekly',
  'monthly',
  'never'
] as const;
export type NotificationFrequency = typeof notificationFrequencies[number];

/**
 * Schema for notification preferences per category
 */
export const categoryPreferencesSchema = createSchemaSet({
  enabled: z.boolean().default(true),
  channels: z.array(z.enum(notificationChannels))
    .min(1, 'Select at least one notification channel'),
  frequency: z.enum(notificationFrequencies)
    .default('immediately')
});

/**
 * Schema for notification schedule (quiet hours)
 */
export const scheduleSchema = createSchemaSet({
  quietHours: z.object({
    enabled: z.boolean().default(false),
    start: createStringField({
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Invalid time format (HH:mm)'
    }),
    end: createStringField({
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Invalid time format (HH:mm)'
    })
  }).refine(
    (data) => !data.enabled || data.start !== data.end,
    {
      message: 'Start and end times cannot be the same when quiet hours are enabled',
      path: ['end']
    }
  ),
  timezone: createStringField().default('UTC')
});

/**
 * Schema for notification frequency limits
 */
export const frequencyLimitsSchema = createSchemaSet({
  maxPerHour: createNumberField({
    min: 0,
    max: 60,
    integer: true
  }).default(20),
  maxPerDay: createNumberField({
    min: 0,
    max: 1000,
    integer: true
  }).default(100),
  digestEmail: z.object({
    enabled: z.boolean().default(true),
    frequency: z.enum(['daily', 'weekly']).default('daily'),
    time: createStringField({
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Invalid time format (HH:mm)'
    })
  })
});

/**
 * Schema for notification preferences
 */
export const notificationPreferencesSchema = createSchemaSet({
  preferences: z.record(
    z.enum(notificationCategories),
    categoryPreferencesSchema.row
  )
});

/**
 * Combined notification settings schema
 */
export const notificationSettingsSchema = createSchemaSet({
  preferences: notificationPreferencesSchema.row,
  schedule: scheduleSchema.row,
  frequency: frequencyLimitsSchema.row
});

/**
 * Schema for updating individual category settings
 */
export const categoryUpdateSchema = createSchemaSet({
  category: z.enum(notificationCategories),
  settings: categoryPreferencesSchema.row
});

/**
 * Schema for updating global settings
 */
export const globalSettingsSchema = createSchemaSet({
  schedule: scheduleSchema.row,
  frequency: frequencyLimitsSchema.row
});

// Type exports
export type CategoryPreferencesSchema = z.infer<typeof categoryPreferencesSchema.row>;
export type ScheduleSchema = z.infer<typeof scheduleSchema.row>;
export type FrequencyLimitsSchema = z.infer<typeof frequencyLimitsSchema.row>;
export type NotificationPreferencesSchema = z.infer<typeof notificationPreferencesSchema.row>;
export type NotificationSettingsSchema = z.infer<typeof notificationSettingsSchema.row>;
export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema.row>;
export type GlobalSettingsSchema = z.infer<typeof globalSettingsSchema.row>;

/**
 * Type for notification-related actions
 */
export type NotificationAction = 
  | { type: 'update_preferences'; data: NotificationPreferencesSchema }
  | { type: 'update_schedule'; data: ScheduleSchema }
  | { type: 'update_frequency'; data: FrequencyLimitsSchema }
  | { type: 'update_category'; data: CategoryUpdateSchema }
  | { type: 'update_global'; data: GlobalSettingsSchema }
  | { type: 'toggle_channel'; channel: NotificationChannel; enabled: boolean }
  | { type: 'toggle_category'; category: NotificationCategory; enabled: boolean }; 