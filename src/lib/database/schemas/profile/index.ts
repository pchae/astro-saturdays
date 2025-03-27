import { z } from 'zod';
import { createSchemaSet } from '../../utils/factories';

/**
 * Schema for basic profile information
 */
export const profileSchema = createSchemaSet({
  username: z.string().min(3).max(20),
  fullName: z.string().min(2).max(50),
  avatarUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  bio: z.string().max(500).optional()
});

export type ProfileSchema = z.infer<typeof profileSchema.row>; 