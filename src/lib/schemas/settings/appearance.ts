import { z } from "zod"
import { languageSchema, themeSchema } from "../base/common"

export const fontSizeSchema = z.enum(["xs", "sm", "base", "lg", "xl"], {
  description: "Available font size options",
})

export const colorSchemeSchema = z.enum(["default", "deuteranopia", "protanopia", "tritanopia"], {
  description: "Available color scheme options for accessibility",
})

export const layoutDensitySchema = z.enum(["compact", "comfortable", "spacious"], {
  description: "Available layout density options",
})

export const appearanceFormSchema = z.object({
  theme: themeSchema,
  language: languageSchema,
  accessibility: z.object({
    colorScheme: colorSchemeSchema.default("default"),
    reduceMotion: z.boolean().default(false),
    highContrast: z.boolean().default(false),
    fontSize: fontSizeSchema.default("base"),
  }),
  layout: z.object({
    density: layoutDensitySchema.default("comfortable"),
    sidebarPosition: z.enum(["left", "right"]).default("left"),
    showAvatars: z.boolean().default(true),
    enableAnimations: z.boolean().default(true),
  }),
  customization: z.object({
    accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional(),
    customFont: z.string().optional(),
    customCss: z.string().optional(),
  }).optional(),
  dateTimeFormat: z.object({
    timeZone: z.string().default("UTC"),
    dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("YYYY-MM-DD"),
    timeFormat: z.enum(["12h", "24h"]).default("24h"),
    firstDayOfWeek: z.enum(["sunday", "monday"]).default("monday"),
  }),
})

export type AppearanceFormData = z.infer<typeof appearanceFormSchema>

// Schema for updating accessibility settings only
export const accessibilitySchema = z.object({
  colorScheme: colorSchemeSchema.default("default"),
  reduceMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  fontSize: fontSizeSchema.default("base"),
})
export type AccessibilityData = z.infer<typeof accessibilitySchema>

// Schema for updating layout settings only
export const layoutSchema = z.object({
  density: layoutDensitySchema.default("comfortable"),
  sidebarPosition: z.enum(["left", "right"]).default("left"),
  showAvatars: z.boolean().default(true),
  enableAnimations: z.boolean().default(true),
})
export type LayoutData = z.infer<typeof layoutSchema>

// Schema for updating date/time format settings only
export const dateTimeFormatSchema = z.object({
  timeZone: z.string().default("UTC"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("YYYY-MM-DD"),
  timeFormat: z.enum(["12h", "24h"]).default("24h"),
  firstDayOfWeek: z.enum(["sunday", "monday"]).default("monday"),
})
export type DateTimeFormatData = z.infer<typeof dateTimeFormatSchema> 