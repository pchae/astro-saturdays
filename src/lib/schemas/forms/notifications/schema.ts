import { z } from "zod"

/**
 * Schema for notification channels
 */
export const notificationChannelSchema = z.enum([
  "email",
  "push",
  "in_app",
  "sms"
]).describe("Available notification channels")

/**
 * Schema for notification categories
 */
export const notificationCategorySchema = z.enum([
  "security",
  "updates",
  "marketing",
  "social",
  "system"
]).describe("Notification categories")

/**
 * Schema for notification preferences
 */
export const notificationPreferencesSchema = z.object({
  channels: z.object({
    email: z.boolean().describe("Enable email notifications"),
    push: z.boolean().describe("Enable push notifications"),
    in_app: z.boolean().describe("Enable in-app notifications"),
    sms: z.boolean().describe("Enable SMS notifications"),
  }),
  categories: z.record(notificationCategorySchema, z.boolean())
    .describe("Category-specific notification preferences"),
})

/**
 * Schema for notification schedule
 */
export const notificationScheduleSchema = z.object({
  quietHours: z.object({
    enabled: z.boolean().describe("Enable quiet hours"),
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
      .describe("Quiet hours start time (HH:mm)"),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
      .describe("Quiet hours end time (HH:mm)"),
  }),
  timezone: z.string().describe("User's timezone for notifications"),
})

/**
 * Schema for notification frequency
 */
export const notificationFrequencySchema = z.object({
  digest: z.enum(["never", "daily", "weekly", "monthly"])
    .describe("Frequency of notification digests"),
  maxPerHour: z.number()
    .min(0)
    .max(60)
    .describe("Maximum notifications per hour"),
  maxPerDay: z.number()
    .min(0)
    .max(1000)
    .describe("Maximum notifications per day"),
}) 