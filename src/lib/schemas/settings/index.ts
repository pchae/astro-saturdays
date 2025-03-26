import { z } from "zod"
import { profileFormSchema } from "./profile"
import { notificationFormSchema } from "./notifications"
import { securityFormSchema } from "./security"

/**
 * Combined schema for all settings
 * @description Combines all settings-related schemas into a single validation schema
 */
export const settingsSchema = z.object({
  profile: profileFormSchema,
  notifications: notificationFormSchema,
  security: securityFormSchema,
})

/**
 * Type for the complete settings form data
 */
export type SettingsFormData = z.infer<typeof settingsSchema>

/**
 * Schema for partial settings updates
 * @description Allows updating individual settings fields while maintaining type safety
 */
export const settingsUpdateSchema = settingsSchema.partial()
export type SettingsUpdateData = z.infer<typeof settingsUpdateSchema>

// Re-export all schemas and types from individual modules
export * from "./profile"
export * from "./notifications"
export * from "./security" 