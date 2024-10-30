/**
 * Product Variant Data Transfer Objects (DTOs)
 * Handle product variant data transformations
 *
 * @module product/dtos
 */

import { ProductImage, ProductPrice } from "./types";

/**
 * Product variant response DTO
 */
export interface ProductVariantDto {
  /** Variant unique identifier */
  id: string;
  /** Parent product ID */
  productId: string;
  /** Variant title */
  title: string;
  /** Variant options */
  options: {
    /** Size option */
    size?: string;
    /** Color option */
    color?: string;
    /** Style option */
    style?: string;
    /** Additional options */
    [key: string]: string | undefined;
  };
  /** Variant SKU */
  sku: string;
  /** Variant barcode */
  barcode?: string;
  /** Variant images */
  images: ProductImage[];
  /** Variant pricing */
  pricing: ProductPrice;
  /** Variant inventory */
  inventory: {
    /** Available quantity */
    quantity: number;
    /** Reserved quantity */
    reserved: number;
    /** Allow backorder */
    allowBackorder: boolean;
    /** Incoming stock */
    incoming?: {
      quantity: number;
      expectedAt: number;
    };
  };
  /** Variant status */
  status: {
    /** Is active */
    active: boolean;
    /** Is default variant */
    isDefault: boolean;
    /** Sort order */
    sortOrder: number;
  };
}

/**
 * Create variant request DTO
 */
export interface CreateVariantRequestDto {
  /** Parent product ID */
  productId: string;
  /** Variant options */
  options: {
    size?: string;
    color?: string;
    style?: string;
    [key: string]: string | undefined;
  };
  /** Variant SKU */
  sku?: string;
  /** Initial pricing */
  pricing: Omit<ProductPrice, "currency">;
  /** Initial inventory */
  inventory: {
    quantity: number;
    allowBackorder?: boolean;
  };
}

/**
 * Bulk variant creation request DTO
 */
export interface BulkCreateVariantsRequestDto {
  /** Parent product ID */
  productId: string;
  /** Option combinations */
  combinations: Array<{
    options: Record<string, string>;
    sku?: string;
    pricing?: Omit<ProductPrice, "currency">;
    inventory?: {
      quantity: number;
      allowBackorder?: boolean;
    };
  }>;
}
