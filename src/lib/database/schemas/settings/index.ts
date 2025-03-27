import { z } from 'zod';
import { createSchemaSet } from '../../utils/factories';
import { securitySettingsSchema } from './security';
import { profileSettingsSchema } from './profile';
import { notificationSettingsSchema } from './notifications';

/**
 * Combined schema for all settings
 */
export const settingsSchema = createSchemaSet({
  security: securitySettingsSchema.row,
  profile: profileSettingsSchema.row,
  notifications: notificationSettingsSchema.row
});

// Type exports
export type SettingsSchema = z.infer<typeof settingsSchema.row>;

/**
 * Type for settings section identifiers
 */
export type SettingsSection = keyof SettingsSchema;

// Re-export all settings schemas
export * from './security';
export * from './profile';
export * from './notifications'; 