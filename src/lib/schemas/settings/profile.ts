import { z } from "zod"
import { emailSchema, textFieldSchema, urlSchema } from "../base/common"
import { optionalString } from "../base/validation"

export const profileFormSchema = z.object({
  fullName: textFieldSchema({ min: 2, max: 50 }),
  email: emailSchema,
  bio: optionalString(textFieldSchema({ max: 500 })),
  avatarUrl: urlSchema,
})

export type ProfileFormData = z.infer<typeof profileFormSchema>

// Partial schema for updates
export const profileUpdateSchema = profileFormSchema.partial()
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema> 