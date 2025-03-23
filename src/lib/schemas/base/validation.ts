import { z } from "zod"

// Helper to make all properties in a schema optional
export const makeOptional = <T extends z.ZodObject<any>>(schema: T) => {
  return schema.extend(
    Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => [
        key,
        value instanceof z.ZodOptional ? value : (value as z.ZodTypeAny).optional(),
      ])
    )
  )
}

// Helper to transform empty strings to undefined
export const emptyStringToUndefined = z.literal("").transform(() => undefined)

// Helper to handle optional string fields that can be empty
export const optionalString = (schema: z.ZodString) =>
  z.preprocess((value) => {
    if (value === "") return undefined
    return value
  }, schema.optional())

// Helper to create a schema for file uploads with size and type validation
export const createFileSchema = ({
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ["image/jpeg", "image/png", "image/gif"],
}: {
  maxSize?: number
  allowedTypes?: string[]
} = {}) =>
  z.object({
    size: z.number().max(maxSize, `File size must be less than ${maxSize / 1024 / 1024}MB`),
    type: z.enum(allowedTypes as [string, ...string[]], {
      description: `File must be one of: ${allowedTypes.join(", ")}`,
    }),
  })

// Helper to validate array length
export const arrayLengthSchema = (options: { min?: number; max?: number }) =>
  z.array(z.any()).superRefine((val, ctx) => {
    if (options.min !== undefined && val.length < options.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: options.min,
        type: "array",
        inclusive: true,
        message: `Array must contain at least ${options.min} item(s)`,
      })
    }
    if (options.max !== undefined && val.length > options.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: options.max,
        type: "array",
        inclusive: true,
        message: `Array must contain at most ${options.max} item(s)`,
      })
    }
  })

// Helper to create a schema that requires at least one field to be defined
export const requireAtLeastOne = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape).superRefine((val, ctx) => {
    const definedFields = Object.entries(val).filter(([_, v]) => v !== undefined)
    if (definedFields.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be defined",
      })
    }
  })
} 