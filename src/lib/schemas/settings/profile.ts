import { z } from "zod"
import { 
  emailSchema, 
  usernameSchema, 
  urlSchema, 
  languageSchema,
  textFieldSchema 
} from "../base/field-schemas"
import { optionalString } from "../base/validation"

/**
 * Base schema for profile information
 * @description Validates user profile information including personal and professional details
 */
const baseProfileSchema = z.object({
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

// Exported schemas

/**
 * Schema for the complete profile form
 */
export const profileFormSchema = baseProfileSchema
export type ProfileFormData = z.infer<typeof profileFormSchema>

/**
 * Schema for partial profile updates
 */
export const profileUpdateSchema = profileFormSchema.partial()
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

/**
 * Schema for profile picture updates
 */
export const profilePictureSchema = z.object({
  avatarUrl: urlSchema
    .describe("URL to user's new avatar image"),
})
export type ProfilePictureData = z.infer<typeof profilePictureSchema>

/**
 * Schema for basic profile information
 */
export const basicProfileSchema = profileFormSchema.pick({
  fullName: true,
  email: true,
  username: true,
  avatarUrl: true,
})
export type BasicProfileData = z.infer<typeof basicProfileSchema>

/**
 * Union type for all possible profile-related data structures
 */
export type ProfileData = 
  | { type: "complete"; data: ProfileFormData }
  | { type: "update"; data: ProfileUpdateData }
  | { type: "picture"; data: ProfilePictureData }
  | { type: "basic"; data: BasicProfileData } 