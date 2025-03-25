import { z } from "zod"
import { 
  profileFormSchema, 
  profileUpdateSchema, 
  profilePictureSchema,
  basicProfileSchema 
} from "./schema"

/**
 * Type for the complete profile form data
 */
export type ProfileFormData = z.infer<typeof profileFormSchema>

/**
 * Type for partial profile updates
 */
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

/**
 * Type for profile picture updates
 */
export type ProfilePictureData = z.infer<typeof profilePictureSchema>

/**
 * Type for basic profile information
 */
export type BasicProfileData = z.infer<typeof basicProfileSchema>

/**
 * Union type for all possible profile-related data structures
 */
export type ProfileData = 
  | { type: "complete"; data: ProfileFormData }
  | { type: "update"; data: ProfileUpdateData }
  | { type: "picture"; data: ProfilePictureData }
  | { type: "basic"; data: BasicProfileData } 