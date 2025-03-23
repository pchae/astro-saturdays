import { z } from "zod"
import { passwordSchema } from "../base/common"

const baseSecuritySchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
  twoFactorEnabled: z.boolean().default(false),
  recoveryEmail: z
    .string()
    .email("Please enter a valid recovery email")
    .optional(),
  securityQuestions: z.array(
    z.object({
      question: z.string().min(1, "Security question is required"),
      answer: z.string().min(1, "Security answer is required"),
    })
  ).optional(),
  sessionManagement: z.object({
    rememberMe: z.boolean().default(true),
    sessionTimeout: z.number().min(5).max(60).default(30), // minutes
    allowMultipleSessions: z.boolean().default(true),
  }),
})

export const securityFormSchema = baseSecuritySchema.refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  }
)

export type SecurityFormData = z.infer<typeof securityFormSchema>

// Schema for password change only
export const passwordChangeSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
})

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

// Schema for 2FA settings only
export const twoFactorSettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  recoveryEmail: z.string().email("Please enter a valid recovery email").optional(),
})

export type TwoFactorSettingsData = z.infer<typeof twoFactorSettingsSchema> 