import { z } from "zod";

/**
 * Zod schema for validating Address data
 */
export const addressSchema = z.object({
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^\d{5,6}$/, "Invalid postal code format"),
  country: z.string().min(1, "Country is required"),
  addressType: z.enum(["home", "work", "other"]),
});

/**
 * Zod schema for validating CartItem data
 */
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

/**
 * Zod schema for validating User data
 * Includes all required and optional fields with validation rules
 */
export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),

  email: z.string().email("Invalid email format").min(1, "Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    )
    .optional(),

  googleId: z.string().optional(),

  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number format")
    .optional(),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  following: z.array(z.string()),

  addresses: z.array(addressSchema),

  isDesigner: z.boolean().default(false),

  designerId: z.string().optional(),

  cart: z.array(cartItemSchema),
});

/**
 * Type representing the inferred User schema type
 */
export type UserSchemaType = z.infer<typeof userSchema>;

/**
 * Schema for user creation, omitting certain fields
 */
export const createUserSchema = userSchema.omit({
  following: true,
  addresses: true,
  cart: true,
  designerId: true,
});

/**
 * Schema for updating user profile
 */
export const updateUserSchema = userSchema.partial().omit({
  email: true,
  googleId: true,
});
