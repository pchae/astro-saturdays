import { z } from 'zod';
import { createSchemaSet, createStringField, createNumberField } from '../../../utils/factories';
import { patterns } from '../../../core/validators';
import { VALIDATION_MESSAGES } from '../../../core/messages';

/**
 * Schema for password management
 */
const basePasswordSchema = createSchemaSet({
  currentPassword: createStringField(),
  newPassword: createStringField({
    min: 8,
    pattern: patterns.password,
    message: VALIDATION_MESSAGES.custom.password()
  }),
  confirmPassword: z.string()
});

export const passwordSchema = basePasswordSchema.row.refine(
  data => data.newPassword === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword']
  }
);

/**
 * Schema for two-factor authentication
 */
export const twoFactorSchema = createSchemaSet({
  enabled: z.boolean().default(false),
  method: z.enum(['app', 'sms', 'email']),
  phone: createStringField({
    pattern: patterns.phone,
    message: VALIDATION_MESSAGES.custom.phone()
  }).optional(),
  recoveryEmail: createStringField({
    pattern: patterns.email,
    message: VALIDATION_MESSAGES.string.email()
  }).optional(),
  backupCodes: z.array(z.string()).optional()
});

/**
 * Schema for security questions
 */
export const securityQuestionsSchema = createSchemaSet({
  questions: z.array(
    z.object({
      question: createStringField({ min: 1 }),
      answer: createStringField({ min: 1 })
    })
  ).min(2).max(5)
});

/**
 * Schema for session management
 */
export const sessionSchema = createSchemaSet({
  rememberMe: z.boolean().default(true),
  sessionTimeout: createNumberField({
    min: 5,
    max: 1440,
    integer: true
  }),
  maxSessions: createNumberField({
    min: 1,
    max: 5,
    integer: true
  }).default(1),
  allowMultipleSessions: z.boolean().default(false)
});

/**
 * Combined security settings schema
 */
export const securitySettingsSchema = createSchemaSet({
  password: passwordSchema,
  twoFactor: twoFactorSchema.row,
  securityQuestions: securityQuestionsSchema.row,
  sessionManagement: sessionSchema.row
});

// Type exports
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type TwoFactorSchema = z.infer<typeof twoFactorSchema.row>;
export type SecurityQuestionsSchema = z.infer<typeof securityQuestionsSchema.row>;
export type SessionSchema = z.infer<typeof sessionSchema.row>;
export type SecuritySettingsSchema = z.infer<typeof securitySettingsSchema.row>;

/**
 * Type for security-related actions
 */
export type SecurityAction = 
  | { type: 'password_change'; data: PasswordSchema }
  | { type: '2fa_update'; data: TwoFactorSchema }
  | { type: 'questions_update'; data: SecurityQuestionsSchema }
  | { type: 'session_update'; data: SessionSchema }; 