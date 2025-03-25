import { z } from "zod"
import { passwordSchema } from "../../base/common"

/**
 * Schema for password change form
 */
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, "Current password is required")
    .describe("User's current password"),
  newPassword: passwordSchema
    .describe("New password that meets security requirements"),
  confirmPassword: z.string()
    .min(1, "Password confirmation is required")
    .describe("Confirmation of the new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

/**
 * Schema for two-factor authentication settings
 */
export const twoFactorSettingsSchema = z.object({
  enabled: z.boolean()
    .describe("Whether 2FA is enabled"),
  method: z.enum(["app", "sms", "email"])
    .describe("Preferred 2FA method"),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .describe("Phone number for SMS 2FA"),
  backupCodes: z.array(z.string())
    .optional()
    .describe("Backup codes for account recovery"),
})

/**
 * Schema for security questions
 */
export const securityQuestionsSchema = z.object({
  question1: z.string()
    .min(1, "Security question is required")
    .describe("First security question"),
  answer1: z.string()
    .min(1, "Answer is required")
    .describe("Answer to first security question"),
  question2: z.string()
    .min(1, "Security question is required")
    .describe("Second security question"),
  answer2: z.string()
    .min(1, "Answer is required")
    .describe("Answer to second security question"),
})

/**
 * Schema for session management
 */
export const sessionManagementSchema = z.object({
  maxSessions: z.number()
    .min(1)
    .max(10)
    .describe("Maximum number of concurrent sessions"),
  sessionTimeout: z.number()
    .min(15)
    .max(1440)
    .describe("Session timeout in minutes"),
}) 