import { z } from 'zod';

/**
 * Base type for JSON data, matching Supabase's Json type
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Base interface for all schema definitions
 */
export interface SchemaDefinition<T extends z.ZodRawShape> {
  row: z.ZodObject<T>;
  insert: z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> | T[K] }>;
  update: z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> }>;
}

/**
 * Base type for validation errors
 */
export interface ValidationError {
  path: string[];
  message: string;
}

/**
 * Base type for validation results
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Utility type to extract the inferred type from a schema
 */
export type InferSchemaType<T extends SchemaDefinition<any>> = z.infer<T['row']>; 