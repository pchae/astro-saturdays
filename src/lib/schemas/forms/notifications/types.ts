import { z } from "zod"
import {
  notificationChannelSchema,
  notificationCategorySchema,
  notificationPreferencesSchema,
  notificationScheduleSchema,
  notificationFrequencySchema,
} from "./schema"

/**
 * Type for notification channels
 */
export type NotificationChannel = z.infer<typeof notificationChannelSchema>

/**
 * Type for notification categories
 */
export type NotificationCategory = z.infer<typeof notificationCategorySchema>

/**
 * Type for notification preferences
 */
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>

/**
 * Type for notification schedule
 */
export type NotificationSchedule = z.infer<typeof notificationScheduleSchema>

/**
 * Type for notification frequency
 */
export type NotificationFrequency = z.infer<typeof notificationFrequencySchema>

/**
 * Combined type for all notification settings
 */
export type NotificationSettings = {
  preferences: NotificationPreferences
  schedule: NotificationSchedule
  frequency: NotificationFrequency
}

/**
 * Union type for all possible notification-related actions
 */
export type NotificationAction = 
  | { type: "update_preferences"; data: NotificationPreferences }
  | { type: "update_schedule"; data: NotificationSchedule }
  | { type: "update_frequency"; data: NotificationFrequency }
  | { type: "toggle_channel"; channel: NotificationChannel; enabled: boolean }
  | { type: "toggle_category"; category: NotificationCategory; enabled: boolean } 