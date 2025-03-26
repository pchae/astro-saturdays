import { z } from "zod"
import { profileFormSchema } from "./profile"
import { notificationFormSchema } from "./notifications"
import { privacyFormSchema } from "./privacy"

/**
 * Combined schema for all settings
 * @description Combines all settings-related schemas into a single validation schema
 */
export const settingsSchema = z.object({
  profile: profileFormSchema,
  notifications: notificationFormSchema,
  privacy: privacyFormSchema,
})

export type SettingsFormData = z.infer<typeof settingsSchema>

/**
 * Schema for partial settings updates
 */
export const settingsUpdateSchema = settingsSchema.partial()
export type SettingsUpdateData = z.infer<typeof settingsUpdateSchema>

// Re-export all schemas and types from individual modules
export * from "./profile"
export * from "./notifications"
export * from "./privacy" 