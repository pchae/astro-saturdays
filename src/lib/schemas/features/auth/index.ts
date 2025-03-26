import { z } from 'zod';
import { createSchemaSet, createStringField } from '../../utils/factories';
import { patterns } from '../../core/validators';
import { VALIDATION_MESSAGES } from '../../core/messages';

/**
 * Schema for user credentials
 */
export const credentialsSchema = createSchemaSet({
  email: createStringField({
    pattern: patterns.email,
    message: VALIDATION_MESSAGES.string.email()
  }),
  password: createStringField({
    min: 8,
    pattern: patterns.password,
    message: VALIDATION_MESSAGES.custom.password()
  })
});

/**
 * Schema for user registration
 */
export const registrationSchema = createSchemaSet({
  email: createStringField({
    pattern: patterns.email,
    message: VALIDATION_MESSAGES.string.email()
  }),
  password: createStringField({
    min: 8,
    pattern: patterns.password,
    message: VALIDATION_MESSAGES.custom.password()
  }),
  confirmPassword: z.string(),
  username: createStringField({
    min: 3,
    max: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: VALIDATION_MESSAGES.custom.username()
  })
}).row.refine(
  data => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword']
  }
);

/**
 * Schema for password reset
 */
export const passwordResetSchema = createSchemaSet({
  email: createStringField({
    pattern: patterns.email,
    message: VALIDATION_MESSAGES.string.email()
  })
});

/**
 * Schema for password change
 */
export const passwordChangeSchema = createSchemaSet({
  currentPassword: createStringField(),
  newPassword: createStringField({
    min: 8,
    pattern: patterns.password,
    message: VALIDATION_MESSAGES.custom.password()
  }),
  confirmNewPassword: z.string()
}).row.refine(
  data => data.newPassword === data.confirmNewPassword,
  {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
  }
); 