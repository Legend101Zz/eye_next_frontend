import { z } from "zod";

/**
 * Validation schema for Image data
 */
export const imageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  filename: z.string().min(1, "Filename is required"),
});

/**
 * Validation schema for Designer Settings
 */
export const designerSettingsSchema = z.object({
  isPrivate: z.boolean().default(false),
  showDesigns: z.object({
    enabled: z.boolean().default(true),
    designIds: z.array(z.string()),
  }),
  showFollowers: z.boolean().default(true),
  showFullName: z.boolean().default(true),
  showPhone: z.boolean().default(true),
  showDescription: z.boolean().default(true),
  showCoverPhoto: z.boolean().default(true),
  showProfilePhoto: z.boolean().default(true),
  socialMedia: z.array(z.string().url("Invalid social media URL")),
  portfolioLinks: z.array(z.string().url("Invalid portfolio URL")),
});

/**
 * Main Designer validation schema
 */
export const designerSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  followers: z.array(z.string()),
  profileImage: imageSchema.optional(),
  coverImage: imageSchema.optional(),
  isApproved: z.boolean().default(false),
  designs: z.array(z.string()),

  legalFirstName: z
    .string()
    .min(2, "Legal first name must be at least 2 characters")
    .max(50, "Legal first name cannot exceed 50 characters"),

  legalLastName: z
    .string()
    .min(2, "Legal last name must be at least 2 characters")
    .max(50, "Legal last name cannot exceed 50 characters"),

  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  artistName: z
    .string()
    .min(2, "Artist name must be at least 2 characters")
    .max(50, "Artist name cannot exceed 50 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  socialMedia: z.array(z.string().url("Invalid social media URL")),

  phone: z.number().int("Phone number must be an integer").optional(),

  portfolioLinks: z.array(z.string().url("Invalid portfolio URL")),
  cvLinks: z.array(z.string().url("Invalid CV link")),

  legalAddresses: z.array(z.string()),

  panCard: imageSchema.optional(),
  panCardNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card number format")
    .optional(),

  settings: designerSettingsSchema,
});

/**
 * Schema for creating a new designer
 */
export const createDesignerSchema = designerSchema.omit({
  followers: true,
  designs: true,
  isApproved: true,
});

/**
 * Schema for updating designer information
 */
export const updateDesignerSchema = designerSchema
  .partial()
  .omit({ userId: true });

/**
 * Type representing the inferred Designer schema type
 */
export type DesignerSchemaType = z.infer<typeof designerSchema>;
