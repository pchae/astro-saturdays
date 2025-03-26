import { z } from "zod"
import { passwordSchema } from "../base/common"

// Constants for validation
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/
const MIN_SESSION_TIMEOUT = 5
const MAX_SESSION_TIMEOUT = 60
const DEFAULT_SESSION_TIMEOUT = 30
const MAX_CONCURRENT_SESSIONS = 10

/**
 * Base schema for password-related operations
 */
const basePasswordSchema = z.object({
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
 * Base schema for two-factor authentication settings
 */
const baseTwoFactorSchema = z.object({
  enabled: z.boolean()
    .default(false)
    .describe("Whether 2FA is enabled"),
  method: z.enum(["app", "sms", "email"])
    .describe("Preferred 2FA method"),
  phone: z.string()
    .regex(PHONE_REGEX, "Invalid phone number")
    .optional()
    .describe("Phone number for SMS 2FA"),
  recoveryEmail: z.string()
    .email("Please enter a valid recovery email")
    .optional()
    .describe("Backup email for account recovery"),
  backupCodes: z.array(z.string())
    .optional()
    .describe("Backup codes for account recovery"),
})

/**
 * Base schema for security questions
 */
const baseSecurityQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string()
        .min(1, "Security question is required")
        .describe("Security question"),
      answer: z.string()
        .min(1, "Answer is required")
        .describe("Answer to security question"),
    })
  ).min(2, "At least two security questions are required")
    .max(3, "Maximum of three security questions allowed")
})

/**
 * Base schema for session management
 */
const baseSessionManagementSchema = z.object({
  rememberMe: z.boolean()
    .default(true)
    .describe("Whether to remember the user's session"),
  sessionTimeout: z.number()
    .min(MIN_SESSION_TIMEOUT)
    .max(MAX_SESSION_TIMEOUT)
    .default(DEFAULT_SESSION_TIMEOUT)
    .describe("Session timeout in minutes"),
  maxSessions: z.number()
    .min(1)
    .max(MAX_CONCURRENT_SESSIONS)
    .default(1)
    .describe("Maximum number of concurrent sessions"),
  allowMultipleSessions: z.boolean()
    .default(false)
    .describe("Whether to allow multiple concurrent sessions"),
})

// Form-specific session management schema
const formSessionManagementSchema = z.object({
  rememberMe: z.boolean()
    .default(true)
    .describe("Whether to remember the user's session"),
  sessionTimeout: z.number()
    .min(MIN_SESSION_TIMEOUT)
    .max(MAX_SESSION_TIMEOUT)
    .default(DEFAULT_SESSION_TIMEOUT)
    .describe("Session timeout in minutes"),
  allowMultipleSessions: z.boolean()
    .default(false)
    .describe("Whether to allow multiple concurrent sessions"),
})

// Exported schemas and types

/**
 * Schema for password change operations
 */
export const passwordChangeSchema = basePasswordSchema
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

/**
 * Schema for two-factor authentication settings
 */
export const twoFactorSettingsSchema = baseTwoFactorSchema
export type TwoFactorSettingsData = z.infer<typeof twoFactorSettingsSchema>

/**
 * Schema for security questions management
 */
export const securityQuestionsSchema = baseSecurityQuestionsSchema
export type SecurityQuestionsData = z.infer<typeof securityQuestionsSchema>

/**
 * Schema for session management settings
 */
export const sessionManagementSchema = baseSessionManagementSchema
export type SessionManagementData = z.infer<typeof sessionManagementSchema>

/**
 * Form-specific schema for security settings
 */
export const securityFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
  twoFactorEnabled: z.boolean().default(false),
  sessionManagement: formSessionManagementSchema,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})
export type SecurityFormData = z.infer<typeof securityFormSchema>

/**
 * Comprehensive security settings schema combining all security features
 */
export const securitySettingsSchema = z.object({
  password: basePasswordSchema,
  twoFactor: baseTwoFactorSchema,
  securityQuestions: baseSecurityQuestionsSchema,
  sessionManagement: baseSessionManagementSchema,
})
export type SecuritySettingsData = z.infer<typeof securitySettingsSchema>

/**
 * Combined type for all security settings
 */
export type SecuritySettings = {
  twoFactor: TwoFactorSettingsData
  securityQuestions: SecurityQuestionsData
  sessionManagement: SessionManagementData
}

/**
 * Union type for all possible security-related actions
 */
export type SecurityAction = 
  | { type: "password_change"; data: PasswordChangeData }
  | { type: "2fa_update"; data: TwoFactorSettingsData }
  | { type: "questions_update"; data: SecurityQuestionsData }
  | { type: "session_update"; data: SessionManagementData }

// Partial schemas for updates
export const securitySettingsUpdateSchema = securitySettingsSchema.partial()
export type SecuritySettingsUpdateData = z.infer<typeof securitySettingsUpdateSchema> 