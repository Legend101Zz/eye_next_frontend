// src/domain/schemas/productSchema.ts

import { z } from "zod";
import { Size, Category, Gender, Color } from "../entities/product.entity";

/**
 * Validation schema for product images
 */
export const productImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  filename: z.string().min(1, "Filename is required"),
  position: z.enum(["front", "back"], {
    errorMap: () => ({ message: "Position must be either front or back" }),
  }),
});

/**
 * Helper function to validate sizes based on category
 */
const validateSizes = (sizes: Size[], category: Category) => {
  if (["shirt", "Tshirt", "hoodie"].includes(category)) {
    return sizes.length > 0;
  }
  return true;
};

/**
 * Main product validation schema
 */
export const productSchema = z
  .object({
    name: z
      .string()
      .min(1, "Product name is required")
      .max(100, "Product name cannot exceed 100 characters"),

    quantity: z
      .number()
      .int("Quantity must be an integer")
      .min(0, "Quantity cannot be negative"),

    colors: z.array(z.nativeEnum(Color)).optional().default([]),

    category: z.nativeEnum(Category, {
      errorMap: () => ({ message: "Invalid product category" }),
    }),

    images: z
      .array(productImageSchema)
      .min(1, "At least one image is required"),

    sizes: z.array(z.nativeEnum(Size)).refine((sizes, ctx) => {
      if (!validateSizes(sizes, ctx.parent.category)) {
        ctx.addIssue({
          code: "custom",
          message: "Sizes are required for apparel products",
        });
        return false;
      }
      return true;
    }),

    basePrice: z.number().positive("Base price must be positive"),

    gender: z.nativeEnum(Gender).default(Gender.UNISEX),
  })
  .refine(
    (data) => {
      // Additional validation for apparel categories
      if (["shirt", "Tshirt", "hoodie"].includes(data.category)) {
        if (!data.sizes || data.sizes.length === 0) {
          return false;
        }
      } else {
        // Non-apparel products should not have sizes
        if (data.sizes && data.sizes.length > 0) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Invalid size configuration for product category",
    },
  );

/**
 * Schema for creating a new product
 */
export const createProductSchema = productSchema;

/**
 * Schema for updating product information
 */
export const updateProductSchema = productSchema.partial();

/**
 * Type representing the inferred Product schema type
 */
export type ProductSchemaType = z.infer<typeof productSchema>;
