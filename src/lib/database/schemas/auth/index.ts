import { z } from 'zod';
import { createSchemaSet } from '../../utils/factories';

/**
 * Schema for authentication credentials
 */
export const authCredentialsSchema = createSchemaSet({
  email: z.string().email(),
  password: z.string().min(8)
});

export type AuthCredentialsSchema = z.infer<typeof authCredentialsSchema.row>; 