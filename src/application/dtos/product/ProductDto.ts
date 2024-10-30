/**
 * Product Data Transfer Objects (DTOs)
 * Handle core product data transformations
 *
 * @module product/dtos
 */

import {
  ProductStatus,
  ProductGender,
  ProductCategory,
  ProductImage,
  ProductPrice,
  ProductShipping,
  SizeType,
} from "./types";

/**
 * Product response DTO
 * Complete product information
 *
 * @example
 * ```typescript
 * const product: ProductDto = {
 *   id: "prod123",
 *   name: "Classic T-Shirt",
 *   category: ProductCategory.TSHIRT,
 *   status: ProductStatus.ACTIVE
 * };
 * ```
 */
export interface ProductDto {
  /** Product unique identifier */
  id: string;
  /** Product name */
  name: string;
  /** Product description */
  description: {
    /** Short description */
    short: string;
    /** Full description */
    full: string;
    /** Bullet points */
    bullets: string[];
  };
  /** Product category */
  category: ProductCategory;
  /** Product status */
  status: ProductStatus;
  /** Product metadata */
  metadata: {
    /** SKU */
    sku: string;
    /** Barcode/UPC */
    barcode?: string;
    /** Brand */
    brand?: string;
    /** Manufacturing location */
    madeIn?: string;
    /** Keywords/tags */
    tags: string[];
    /** Creation date */
    createdAt: number;
    /** Last update date */
    updatedAt: number;
  };
  /** Product specifications */
  specifications: {
    /** Gender target */
    gender: ProductGender;
    /** Size type */
    sizeType: SizeType;
    /** Material composition */
    materials: Record<string, number>;
    /** Care instructions */
    careInstructions: string[];
    /** Additional specifications */
    [key: string]: any;
  };
  /** Product images */
  images: ProductImage[];
  /** Product pricing */
  pricing: ProductPrice;
  /** Inventory information */
  inventory: {
    /** Tracking enabled */
    tracked: boolean;
    /** Total stock */
    total: number;
    /** Reserved stock */
    reserved: number;
    /** Low stock threshold */
    lowStockThreshold: number;
    /** Back order allowed */
    backorderAllowed: boolean;
  };
  /** Shipping information */
  shipping: ProductShipping;
  /** SEO information */
  seo: {
    /** Title */
    title: string;
    /** Description */
    description: string;
    /** Keywords */
    keywords: string[];
    /** Canonical URL */
    canonical?: string;
  };
  /** Related products */
  related: {
    /** Similar products */
    similar: string[];
    /** Complementary products */
    complementary: string[];
    /** Cross-sell products */
    crossSell: string[];
  };
}

/**
 * Create product request DTO
 */
export interface CreateProductRequestDto {
  /** Product name */
  name: string;
  /** Product description */
  description: {
    short: string;
    full: string;
    bullets?: string[];
  };
  /** Product category */
  category: ProductCategory;
  /** Product specifications */
  specifications: {
    gender: ProductGender;
    sizeType: SizeType;
    materials: Record<string, number>;
  };
  /** Initial pricing */
  pricing: Omit<ProductPrice, "currency">;
  /** Initial inventory */
  inventory?: {
    total: number;
    lowStockThreshold?: number;
  };
}

/**
 * Update product request DTO
 */
export interface UpdateProductRequestDto {
  /** Name update */
  name?: string;
  /** Description updates */
  description?: Partial<ProductDto["description"]>;
  /** Status update */
  status?: ProductStatus;
  /** Specification updates */
  specifications?: Partial<ProductDto["specifications"]>;
  /** Pricing updates */
  pricing?: Partial<ProductPrice>;
  /** Inventory updates */
  inventory?: Partial<ProductDto["inventory"]>;
}
