import { z } from "zod"
import { 
  emailSchema, 
  textFieldSchema, 
  urlSchema, 
  usernameSchema,
  languageSchema
} from "../../base/common"
import { optionalString } from "../../base/validation"

/**
 * Schema for the profile form
 * @description Validates user profile information including personal and professional details
 */
export const profileFormSchema = z.object({
  // Personal Information
  fullName: textFieldSchema({ min: 2, max: 50 })
    .describe("User's full name"),
  email: emailSchema
    .describe("User's email address"),
  username: usernameSchema
    .describe("User's unique username"),
  bio: optionalString(textFieldSchema({ max: 500 }))
    .describe("User's biography"),
  avatarUrl: urlSchema
    .describe("URL to user's avatar image"),

  // Professional Information
  jobTitle: optionalString(textFieldSchema({ max: 100 }))
    .describe("User's job title"),
  company: optionalString(textFieldSchema({ max: 100 }))
    .describe("User's company name"),
  website: urlSchema
    .describe("User's personal or professional website"),
  location: optionalString(textFieldSchema({ max: 100 }))
    .describe("User's location"),

  // Preferences
  language: languageSchema
    .describe("User's preferred language"),
  timezone: z.string()
    .min(1, "Timezone is required")
    .describe("User's timezone"),
})

// Partial schema for updates
export const profileUpdateSchema = profileFormSchema.partial()

// Schema for profile picture updates
export const profilePictureSchema = z.object({
  avatarUrl: urlSchema
    .describe("URL to user's new avatar image"),
})

// Schema for basic profile information
export const basicProfileSchema = profileFormSchema.pick({
  fullName: true,
  email: true,
  username: true,
  avatarUrl: true,
}) 