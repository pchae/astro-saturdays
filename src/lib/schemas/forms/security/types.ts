import { z } from "zod"
import {
  passwordChangeSchema,
  twoFactorSettingsSchema,
  securityQuestionsSchema,
  sessionManagementSchema,
} from "./schema"

/**
 * Type for password change form data
 */
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

/**
 * Type for two-factor authentication settings
 */
export type TwoFactorSettingsData = z.infer<typeof twoFactorSettingsSchema>

/**
 * Type for security questions
 */
export type SecurityQuestionsData = z.infer<typeof securityQuestionsSchema>

/**
 * Type for session management settings
 */
export type SessionManagementData = z.infer<typeof sessionManagementSchema>

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