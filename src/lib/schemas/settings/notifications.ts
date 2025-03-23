import { z } from "zod"

export const notificationChannelSchema = z.enum(["email", "push", "in_app", "sms"])

export const notificationFrequencySchema = z.enum([
  "immediately",
  "daily",
  "weekly",
  "never",
])

export const notificationCategorySchema = z.enum([
  "security",
  "account",
  "updates",
  "marketing",
  "social",
])

export const notificationSettingSchema = z.object({
  enabled: z.boolean().default(true),
  channels: z.array(notificationChannelSchema).min(1, "Select at least one notification channel"),
  frequency: notificationFrequencySchema.default("immediately"),
})

export const notificationFormSchema = z.object({
  preferences: z.record(notificationCategorySchema, notificationSettingSchema),
  globalSettings: z.object({
    doNotDisturb: z.object({
      enabled: z.boolean().default(false),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
      timezone: z.string().default("UTC"),
    }),
    pauseAll: z.boolean().default(false),
    digestEmail: z.object({
      enabled: z.boolean().default(true),
      frequency: z.enum(["daily", "weekly"]).default("daily"),
      time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    }),
  }),
  customCategories: z.array(
    z.object({
      name: z.string().min(1, "Category name is required"),
      settings: notificationSettingSchema,
    })
  ).optional(),
}).refine(
  (data) => {
    if (data.globalSettings.doNotDisturb.enabled) {
      const start = data.globalSettings.doNotDisturb.startTime
      const end = data.globalSettings.doNotDisturb.endTime
      return start !== end
    }
    return true
  },
  {
    message: "Do not disturb start and end times cannot be the same",
    path: ["globalSettings", "doNotDisturb"],
  }
)

export type NotificationFormData = z.infer<typeof notificationFormSchema>

// Schema for updating individual category settings
export const categoryUpdateSchema = z.object({
  category: notificationCategorySchema,
  settings: notificationSettingSchema,
})

export type CategoryUpdateData = z.infer<typeof categoryUpdateSchema>

// Schema for updating global settings only
export const globalSettingsSchema = z.object({
  doNotDisturb: z.object({
    enabled: z.boolean().default(false),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    timezone: z.string().default("UTC"),
  }),
  pauseAll: z.boolean().default(false),
  digestEmail: z.object({
    enabled: z.boolean().default(true),
    frequency: z.enum(["daily", "weekly"]).default("daily"),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  }),
})

export type GlobalSettingsData = z.infer<typeof globalSettingsSchema> 