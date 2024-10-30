import { z } from "zod";

/**
 * Design image schema
 */
const designImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  filename: z.string().min(1, "Filename is required"),
});

/**
 * Main design validation schema
 */
export const designSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  designImage: z
    .array(designImageSchema)
    .min(1, "At least one design image is required"),

  designerId: z.string().min(1, "Designer ID is required"),

  finalProducts: z.array(z.string()).default([]),

  isVerified: z.boolean().default(false),
});

/**
 * Schema for creating a new design
 */
export const createDesignSchema = designSchema.omit({
  finalProducts: true,
  isVerified: true,
});

/**
 * Schema for updating a design
 */
export const updateDesignSchema = designSchema.partial();

export type DesignSchemaType = z.infer<typeof designSchema>;
export type CreateDesignSchemaType = z.infer<typeof createDesignSchema>;
