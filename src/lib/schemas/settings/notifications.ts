import { z } from "zod"

// Base schemas

/**
 * Schema for notification channels
 */
const baseNotificationChannelSchema = z.enum([
  "email",
  "push",
  "in_app",
  "sms"
]).describe("Available notification channels")

/**
 * Schema for notification categories
 */
const baseNotificationCategorySchema = z.enum([
  "security",
  "account",
  "updates",
  "marketing",
  "social",
  "system"
]).describe("Notification categories")

/**
 * Schema for notification frequency
 */
const baseNotificationFrequencySchema = z.enum([
  "immediately",
  "daily",
  "weekly",
  "monthly",
  "never",
]).describe("Notification frequency options")

/**
 * Schema for time format validation
 */
const timeFormatSchema = z.string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
  .describe("Time in HH:mm format")

/**
 * Base schema for notification preferences per category
 */
const baseNotificationSettingSchema = z.object({
  enabled: z.boolean()
    .default(true)
    .describe("Whether notifications are enabled for this category"),
  channels: z.array(baseNotificationChannelSchema)
    .min(1, "Select at least one notification channel")
    .describe("Enabled notification channels"),
  frequency: baseNotificationFrequencySchema
    .default("immediately")
    .describe("Notification frequency for this category"),
})

/**
 * Base schema for notification schedule (quiet hours)
 */
const baseScheduleSchema = z.object({
  quietHours: z.object({
    enabled: z.boolean()
      .default(false)
      .describe("Enable quiet hours"),
    start: timeFormatSchema
      .describe("Quiet hours start time"),
    end: timeFormatSchema
      .describe("Quiet hours end time"),
  }).refine(
    (data) => !data.enabled || data.start !== data.end,
    {
      message: "Start and end times cannot be the same when quiet hours are enabled",
      path: ["end"],
    }
  ),
  timezone: z.string()
    .default("UTC")
    .describe("User's timezone for notifications"),
})

/**
 * Base schema for notification frequency limits
 */
const baseFrequencyLimitsSchema = z.object({
  maxPerHour: z.number()
    .min(0)
    .max(60)
    .default(20)
    .describe("Maximum notifications per hour"),
  maxPerDay: z.number()
    .min(0)
    .max(1000)
    .default(100)
    .describe("Maximum notifications per day"),
  digestEmail: z.object({
    enabled: z.boolean()
      .default(true)
      .describe("Enable digest emails"),
    frequency: z.enum(["daily", "weekly"])
      .default("daily")
      .describe("Digest email frequency"),
    time: timeFormatSchema
      .describe("Time to send digest"),
  }),
})

// Exported schemas and types

/**
 * Schema for notification preferences
 */
export const notificationPreferencesSchema = z.object({
  preferences: z.record(
    baseNotificationCategorySchema,
    baseNotificationSettingSchema
  ).describe("Category-specific notification preferences"),
})
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>

/**
 * Schema for notification schedule
 */
export const notificationScheduleSchema = baseScheduleSchema
export type NotificationSchedule = z.infer<typeof notificationScheduleSchema>

/**
 * Schema for notification frequency settings
 */
export const notificationFrequencySchema = baseFrequencyLimitsSchema
export type NotificationFrequency = z.infer<typeof notificationFrequencySchema>

/**
 * Combined schema for all notification settings
 */
export const notificationSettingsSchema = z.object({
  preferences: z.record(baseNotificationCategorySchema, baseNotificationSettingSchema),
  schedule: baseScheduleSchema,
  frequency: baseFrequencyLimitsSchema,
})
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>

/**
 * Schema for the notification settings form
 */
export const notificationFormSchema = notificationSettingsSchema
export type NotificationFormData = z.infer<typeof notificationFormSchema>

/**
 * Schema for updating individual category settings
 */
export const categoryUpdateSchema = z.object({
  category: baseNotificationCategorySchema,
  settings: baseNotificationSettingSchema,
})
export type CategoryUpdateData = z.infer<typeof categoryUpdateSchema>

/**
 * Schema for updating global settings
 */
export const globalSettingsSchema = z.object({
  schedule: baseScheduleSchema,
  frequency: baseFrequencyLimitsSchema,
})
export type GlobalSettingsData = z.infer<typeof globalSettingsSchema>

// Export enum types for direct use
export type NotificationChannel = z.infer<typeof baseNotificationChannelSchema>
export type NotificationCategory = z.infer<typeof baseNotificationCategorySchema>

/**
 * Union type for all possible notification-related actions
 */
export type NotificationAction = 
  | { type: "update_preferences"; data: NotificationPreferences }
  | { type: "update_schedule"; data: NotificationSchedule }
  | { type: "update_frequency"; data: NotificationFrequency }
  | { type: "update_category"; data: CategoryUpdateData }
  | { type: "update_global"; data: GlobalSettingsData }
  | { type: "toggle_channel"; channel: NotificationChannel; enabled: boolean }
  | { type: "toggle_category"; category: NotificationCategory; enabled: boolean } 