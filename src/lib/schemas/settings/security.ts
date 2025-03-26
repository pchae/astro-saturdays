import { z } from "zod"
import { 
  passwordSchema, 
  recoveryEmailSchema, 
  phoneSchema, 
  timeoutSchema 
} from "../base/common"
import { VALIDATION_CONSTANTS } from "../base/constants"
import { optionalString } from "../base/validation"

/**
 * Base schema for password-related operations
 * @description Validates password change operations with confirmation
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
 * @description Validates 2FA configuration including method and backup options
 */
const baseTwoFactorSchema = z.object({
  enabled: z.boolean()
    .default(false)
    .describe("Whether 2FA is enabled"),
  method: z.enum(["app", "sms", "email"])
    .describe("Preferred 2FA method"),
  phone: phoneSchema.optional()
    .describe("Phone number for SMS 2FA"),
  recoveryEmail: recoveryEmailSchema.optional()
    .describe("Backup email for account recovery"),
  backupCodes: z.array(z.string())
    .optional()
    .describe("Backup codes for account recovery"),
})

/**
 * Base schema for security questions
 * @description Validates security questions and answers for account recovery
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
  )
  .min(
    VALIDATION_CONSTANTS.SECURITY.MIN_QUESTIONS,
    `At least ${VALIDATION_CONSTANTS.SECURITY.MIN_QUESTIONS} security questions are required`
  )
  .max(
    VALIDATION_CONSTANTS.SECURITY.MAX_QUESTIONS,
    `Maximum of ${VALIDATION_CONSTANTS.SECURITY.MAX_QUESTIONS} security questions allowed`
  ),
})

/**
 * Base schema for session management
 * @description Validates session configuration including timeouts and concurrent sessions
 */
const baseSessionSchema = z.object({
  rememberMe: z.boolean()
    .default(true)
    .describe("Whether to remember the user's session"),
  sessionTimeout: timeoutSchema,
  maxSessions: z.number()
    .min(1)
    .max(VALIDATION_CONSTANTS.SESSION.MAX_CONCURRENT)
    .default(1)
    .describe("Maximum number of concurrent sessions"),
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
export const sessionManagementSchema = baseSessionSchema
export type SessionManagementData = z.infer<typeof sessionManagementSchema>

/**
 * Form-specific schema for security settings
 * @description Combined schema for the security settings form
 */
export const securityFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
  twoFactorEnabled: z.boolean().default(false),
  sessionManagement: baseSessionSchema,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})
export type SecurityFormData = z.infer<typeof securityFormSchema>

/**
 * Comprehensive security settings schema
 * @description Combines all security features into a single schema
 */
export const securitySettingsSchema = z.object({
  password: basePasswordSchema,
  twoFactor: baseTwoFactorSchema,
  securityQuestions: baseSecurityQuestionsSchema,
  sessionManagement: baseSessionSchema,
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

/**
 * Schema for partial security settings updates
 */
export const securitySettingsUpdateSchema = securitySettingsSchema.partial()
export type SecuritySettingsUpdateData = z.infer<typeof securitySettingsUpdateSchema> 