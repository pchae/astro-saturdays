import { z } from "zod"

/**
 * Base schema for privacy settings
 * @description Validates user privacy preferences and visibility settings
 */
const basePrivacySchema = z.object({
  isPublic: z.boolean()
    .default(false)
    .describe("Whether the user's profile is publicly visible"),
  showEmail: z.boolean()
    .default(false)
    .describe("Whether to display the user's email address publicly"),
})

// Exported schemas

/**
 * Schema for the complete privacy settings form
 */
export const privacyFormSchema = basePrivacySchema
export type PrivacyFormData = z.infer<typeof privacyFormSchema>

/**
 * Schema for partial privacy updates
 */
export const privacyUpdateSchema = privacyFormSchema.partial()
export type PrivacyUpdateData = z.infer<typeof privacyUpdateSchema> 