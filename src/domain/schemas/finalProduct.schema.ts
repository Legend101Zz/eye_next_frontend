import { z } from "zod";
import { Size, Gender, Color, Category } from "../entities/product.entity";

/**
 * Design application schema
 */
const designApplicationSchema = z.object({
  designId: z.string().min(1, "Design ID is required"),
  designerId: z.string().min(1, "Designer ID is required"),
  position: z.enum(["front", "back"]),
  appliedImage: z.object({
    url: z.string().url("Invalid image URL"),
    filename: z.string().min(1, "Filename is required"),
    position: z.enum(["front", "back"]),
  }),
});

/**
 * Final product validation schema
 */
export const finalProductSchema = z
  .object({
    productName: z
      .string()
      .min(1, "Product name is required")
      .max(100, "Product name cannot exceed 100 characters"),

    price: z.number().positive("Price must be positive"),

    sales: z.number().nonnegative("Sales cannot be negative").default(0),

    color: z.nativeEnum(Color),
    category: z.nativeEnum(Category),

    baseProductImages: z
      .array(
        z.object({
          url: z.string().url("Invalid image URL"),
          filename: z.string(),
          position: z.enum(["front", "back"]),
        }),
      )
      .min(1, "At least one product image is required"),

    appliedDesigns: z
      .array(designApplicationSchema)
      .min(1, "At least one design must be applied"),

    productId: z.string().min(1, "Product ID is required"),

    sizes: z.array(z.nativeEnum(Size)).optional(),
    gender: z.nativeEnum(Gender).optional(),
  })
  .refine(
    (data) => {
      // Validate sizes for apparel products
      if (["shirt", "Tshirt", "hoodie", "sweatshirt"].includes(data.category)) {
        return data.sizes && data.sizes.length > 0;
      }
      return true;
    },
    {
      message: "Sizes are required for apparel products",
    },
  );

/**
 * Schema for creating a new final product
 */
export const createFinalProductSchema = z.object({
  baseProductId: z.string().min(1, "Base product ID is required"),
  designApplications: z
    .array(
      z.object({
        designId: z.string().min(1, "Design ID is required"),
        position: z.enum(["front", "back"]),
      }),
    )
    .min(1, "At least one design application is required"),
  color: z.nativeEnum(Color),
  priceAdjustment: z.number().optional(),
});

export type FinalProductSchemaType = z.infer<typeof finalProductSchema>;
export type CreateFinalProductSchemaType = z.infer<
  typeof createFinalProductSchema
>;
