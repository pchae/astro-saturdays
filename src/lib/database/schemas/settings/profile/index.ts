import { z } from 'zod';
import { createSchemaSet, createStringField } from '../../../utils/factories';
import { patterns } from '@/lib/schemas/core/validators';
import { VALIDATION_MESSAGES } from '@/lib/schemas/core/messages';

/**
 * Schema for personal information (Matches DB: firstName, lastName, phoneNumber)
 */
export const personalInfoSchema = createSchemaSet({
  firstName: createStringField({
    min: 1, 
    max: 50,
    message: 'First name is required'
  }),
  lastName: createStringField({
    min: 1, 
    max: 50,
    message: 'Last name is required'
  }),
  phoneNumber: createStringField({
    // Add specific phone validation if needed
    message: 'Invalid phone number'
  }).optional(), // Assuming phone number is optional
  // Removed: email, username, bio
});

/**
 * Schema for professional information (Matches DB: companyName, companyPosition)
 */
export const professionalInfoSchema = createSchemaSet({
  companyName: createStringField({
    max: 100,
    message: 'Company name must be less than 100 characters'
  }).optional(), // Assuming optional
  companyPosition: createStringField({
    max: 100,
    message: 'Position must be less than 100 characters'
  }).optional(), // Assuming optional
  // Removed: jobTitle, company, website, location
});

/**
 * Schema for user preferences - REMOVED as these columns don't exist
 */
// export const preferencesSchema = createSchemaSet({
//   language: z.enum(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh']),
//   timezone: createStringField({
//     min: 1,
//     message: 'Timezone is required'
//   })
// });

/**
 * Combined profile settings schema (Updated: Removed preferences)
 */
export const profileSettingsSchema = createSchemaSet({
  personal: personalInfoSchema.row,
  professional: professionalInfoSchema.row,
  // preferences: preferencesSchema.row // Removed
});

/**
 * Schema for basic profile information - REMOVED
 */
// export const basicProfileSchema = ...;

// Type exports
export type PersonalInfoSchema = z.infer<typeof personalInfoSchema.row>;
export type ProfessionalInfoSchema = z.infer<typeof professionalInfoSchema.row>; // Schema is now empty, type might not be needed
// export type PreferencesSchema = z.infer<typeof preferencesSchema.row>; // Removed
export type ProfileSettingsSchema = z.infer<typeof profileSettingsSchema.row>;
// export type BasicProfileSchema = z.infer<typeof basicProfileSchema.row>; // Removed

/**
 * Type for profile-related actions (Updated: Removed preferences_update)
 */
export type ProfileAction =
  | { type: 'personal_update'; data: PersonalInfoSchema }
  | { type: 'professional_update'; data: ProfessionalInfoSchema };
  // | { type: 'preferences_update'; data: PreferencesSchema }; // Removed
  // | { type: 'basic_update'; data: BasicProfileSchema }; // Removed 