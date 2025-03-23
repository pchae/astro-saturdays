import { z } from "zod"
import { emailSchema, textFieldSchema, urlSchema, visibilitySchema } from "../base/common"
import { optionalString } from "../base/validation"

export const profileFormSchema = z.object({
  fullName: textFieldSchema({ min: 2, max: 50 }),
  email: emailSchema,
  bio: optionalString(textFieldSchema({ max: 500 })),
  avatarUrl: urlSchema,
  visibility: visibilitySchema,
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
  }),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>

// Partial schema for updates
export const profileUpdateSchema = profileFormSchema.partial()
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema> 