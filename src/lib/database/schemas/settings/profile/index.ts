import { z } from 'zod';
import { createSchemaSet, createStringField } from '../../../utils/factories';
import { patterns } from '@/lib/schemas/core/validators';
import { VALIDATION_MESSAGES } from '@/lib/schemas/core/messages';

/**
 * Schema for personal information
 */
export const personalInfoSchema = createSchemaSet({
  fullName: createStringField({ 
    min: 2, 
    max: 50,
    message: 'Full name must be between 2 and 50 characters'
  }),
  email: createStringField({
    pattern: patterns.email,
    message: VALIDATION_MESSAGES.string.email()
  }),
  username: createStringField({
    min: 3,
    max: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: VALIDATION_MESSAGES.custom.username()
  }),
  bio: createStringField({
    max: 500,
    message: 'Bio must be less than 500 characters'
  }).optional(),
  avatarUrl: createStringField({
    pattern: patterns.url,
    message: VALIDATION_MESSAGES.string.url('Avatar URL')
  })
});

/**
 * Schema for professional information
 */
export const professionalInfoSchema = createSchemaSet({
  jobTitle: createStringField({
    max: 100,
    message: 'Job title must be less than 100 characters'
  }).optional(),
  company: createStringField({
    max: 100,
    message: 'Company name must be less than 100 characters'
  }).optional(),
  website: createStringField({
    pattern: patterns.url,
    message: VALIDATION_MESSAGES.string.url('Website')
  }),
  location: createStringField({
    max: 100,
    message: 'Location must be less than 100 characters'
  }).optional()
});

/**
 * Schema for user preferences
 */
export const preferencesSchema = createSchemaSet({
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh']),
  timezone: createStringField({
    min: 1,
    message: 'Timezone is required'
  })
});

/**
 * Combined profile settings schema
 */
export const profileSettingsSchema = createSchemaSet({
  personal: personalInfoSchema.row,
  professional: professionalInfoSchema.row,
  preferences: preferencesSchema.row
});

/**
 * Schema for profile picture updates
 */
export const profilePictureSchema = createSchemaSet({
  avatarUrl: createStringField({
    pattern: patterns.url,
    message: VALIDATION_MESSAGES.string.url('Avatar URL')
  })
});

/**
 * Schema for basic profile information
 */
export const basicProfileSchema = createSchemaSet({
  fullName: personalInfoSchema.row.shape.fullName,
  email: personalInfoSchema.row.shape.email,
  username: personalInfoSchema.row.shape.username,
  avatarUrl: personalInfoSchema.row.shape.avatarUrl
});

// Type exports
export type PersonalInfoSchema = z.infer<typeof personalInfoSchema.row>;
export type ProfessionalInfoSchema = z.infer<typeof professionalInfoSchema.row>;
export type PreferencesSchema = z.infer<typeof preferencesSchema.row>;
export type ProfileSettingsSchema = z.infer<typeof profileSettingsSchema.row>;
export type ProfilePictureSchema = z.infer<typeof profilePictureSchema.row>;
export type BasicProfileSchema = z.infer<typeof basicProfileSchema.row>;

/**
 * Type for profile-related actions
 */
export type ProfileAction = 
  | { type: 'personal_update'; data: PersonalInfoSchema }
  | { type: 'professional_update'; data: ProfessionalInfoSchema }
  | { type: 'preferences_update'; data: PreferencesSchema }
  | { type: 'picture_update'; data: ProfilePictureSchema }
  | { type: 'basic_update'; data: BasicProfileSchema }; 