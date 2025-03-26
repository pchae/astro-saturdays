import { z } from 'zod';
import type { SchemaDefinition } from '../core/types';
import { VALIDATION_MESSAGES } from '../core/messages';

/**
 * Options for creating a schema set
 */
export interface CreateSchemaOptions {
  /**
   * Whether to make all fields optional in the insert schema
   */
  optionalInsert?: boolean;
  /**
   * Custom error messages
   */
  messages?: Record<string, string>;
}

/**
 * Creates a complete schema set (row, insert, update) from a base schema
 */
export function createSchemaSet<T extends z.ZodRawShape>(
  shape: T,
  options: CreateSchemaOptions = {}
): SchemaDefinition<T> {
  // Create the base row schema
  const rowSchema = z.object(shape);

  // Create the insert schema - either all fields optional or same as row
  const insertShape = options.optionalInsert
    ? Object.fromEntries(
        Object.entries(shape).map(([key, schema]) => [
          key,
          schema instanceof z.ZodOptional ? schema : schema.optional()
        ])
      ) as { [K in keyof T]: z.ZodOptional<T[K]> | T[K] }
    : shape;
  
  const insertSchema = z.object(insertShape);

  // Create the update schema - all fields optional
  const updateShape = Object.fromEntries(
    Object.entries(shape).map(([key, schema]) => [
      key,
      schema instanceof z.ZodOptional ? schema : schema.optional()
    ])
  ) as { [K in keyof T]: z.ZodOptional<T[K]> };
  
  const updateSchema = z.object(updateShape);

  return {
    row: rowSchema,
    insert: insertSchema,
    update: updateSchema
  };
}

/**
 * Creates a string field with common options
 */
export function createStringField(options?: {
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}) {
  let schema = z.string({
    required_error: VALIDATION_MESSAGES.required('This field'),
    invalid_type_error: 'Must be a string'
  });

  if (options?.min) {
    schema = schema.min(
      options.min,
      options.message ?? VALIDATION_MESSAGES.string.min('This field', options.min)
    );
  }

  if (options?.max) {
    schema = schema.max(
      options.max,
      options.message ?? VALIDATION_MESSAGES.string.max('This field', options.max)
    );
  }

  if (options?.pattern) {
    schema = schema.regex(
      options.pattern,
      options.message ?? VALIDATION_MESSAGES.string.matches('This field', options.pattern.toString())
    );
  }

  return schema;
}

/**
 * Creates a number field with common options
 */
export function createNumberField(options?: {
  min?: number;
  max?: number;
  integer?: boolean;
  message?: string;
}) {
  let schema = z.number({
    required_error: VALIDATION_MESSAGES.required('This field'),
    invalid_type_error: 'Must be a number'
  });

  if (options?.min) {
    schema = schema.min(
      options.min,
      options.message ?? VALIDATION_MESSAGES.number.min('This field', options.min)
    );
  }

  if (options?.max) {
    schema = schema.max(
      options.max,
      options.message ?? VALIDATION_MESSAGES.number.max('This field', options.max)
    );
  }

  if (options?.integer) {
    schema = schema.int(
      options.message ?? VALIDATION_MESSAGES.number.integer('This field')
    );
  }

  return schema;
} 