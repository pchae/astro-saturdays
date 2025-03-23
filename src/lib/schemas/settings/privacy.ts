import { z } from "zod"
import { visibilitySchema } from "../base/common"

export const dataUsageSchema = z.enum([
  "essential_only",
  "functional",
  "personalization",
  "marketing",
  "all",
])

// Activity visibility schema
export const activityVisibilitySchema = z.object({
  likes: visibilitySchema,
  comments: visibilitySchema,
  followers: visibilitySchema,
  following: visibilitySchema,
})

// Data sharing schema
export const dataSharingSchema = z.object({
  allowDataCollection: z.boolean().default(true),
  dataUsageLevel: dataUsageSchema.default("essential_only"),
  shareWithPartners: z.boolean().default(false),
  personalizedAds: z.boolean().default(true),
})

// Cookie preferences schema
export const cookiePreferencesSchema = z.object({
  essential: z.boolean().default(true).readonly(),
  functional: z.boolean().default(true),
  analytics: z.boolean().default(true),
  advertising: z.boolean().default(false),
  thirdParty: z.boolean().default(false),
})

export const privacyFormSchema = z.object({
  profileVisibility: visibilitySchema,
  activityVisibility: activityVisibilitySchema,
  dataSharing: dataSharingSchema,
  contentPreferences: z.object({
    showSensitiveContent: z.boolean().default(false),
    contentFilters: z.array(z.string()).default([]),
    ageRestriction: z.boolean().default(true),
  }),
  searchVisibility: z.object({
    allowProfileInSearch: z.boolean().default(true),
    allowEmailSearch: z.boolean().default(false),
    allowPhoneSearch: z.boolean().default(false),
  }),
  blockList: z.array(
    z.object({
      userId: z.string(),
      reason: z.string().optional(),
      createdAt: z.date().default(() => new Date()),
    })
  ).default([]),
  cookiePreferences: cookiePreferencesSchema,
})

export type PrivacyFormData = z.infer<typeof privacyFormSchema>

// Schema for updating visibility settings only
export const visibilitySettingsSchema = z.object({
  profileVisibility: visibilitySchema,
  activityVisibility: activityVisibilitySchema,
})

export type VisibilitySettingsData = z.infer<typeof visibilitySettingsSchema>
export type DataSharingData = z.infer<typeof dataSharingSchema>
export type CookiePreferencesData = z.infer<typeof cookiePreferencesSchema> 