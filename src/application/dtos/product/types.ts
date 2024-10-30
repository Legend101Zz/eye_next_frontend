/**
 * Shared types for Product DTOs
 * Contains common types and enums used across product-related DTOs
 *
 * @module product/dtos
 */

/**
 * Product status
 */
export enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
  DISCONTINUED = "discontinued",
}

/**
 * Product gender target
 */
export enum ProductGender {
  MENS = "mens",
  WOMENS = "womens",
  UNISEX = "unisex",
  KIDS = "kids",
}

/**
 * Product size type
 */
export enum SizeType {
  REGULAR = "regular",
  PLUS = "plus",
  PETITE = "petite",
  MATERNITY = "maternity",
  KIDS = "kids",
}

/**
 * Product categories
 */
export enum ProductCategory {
  TSHIRT = "tshirt",
  HOODIE = "hoodie",
  SWEATSHIRT = "sweatshirt",
  TANK = "tank",
  LONGSLEEVE = "longsleeve",
  MUG = "mug",
  POSTER = "poster",
  PHONE_CASE = "phone_case",
}

/**
 * Size specifications
 */
export interface SizeSpec {
  /** Size name */
  name: string;
  /** Size code */
  code: string;
  /** Measurements in inches */
  measurements: {
    /** Chest measurement */
    chest?: number;
    /** Length measurement */
    length?: number;
    /** Sleeve length */
    sleeve?: number;
    /** Shoulder width */
    shoulder?: number;
    /** Additional measurements */
    [key: string]: number | undefined;
  };
  /** Size order for sorting */
  order: number;
}

/**
 * Product image structure
 */
export interface ProductImage {
  /** Image URL */
  url: string;
  /** Image alt text */
  alt: string;
  /** Image position/view */
  position: "front" | "back" | "side" | "detail";
  /** Image dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Is primary image */
  isPrimary: boolean;
}

/**
 * Product price structure
 */
export interface ProductPrice {
  /** Base price */
  base: number;
  /** Current price */
  current: number;
  /** Compare at price */
  compareAt?: number;
  /** Currency code */
  currency: string;
  /** Bulk pricing tiers */
  bulkPricing?: Array<{
    /** Minimum quantity */
    minQty: number;
    /** Price per unit */
    price: number;
  }>;
}

/**
 * Product shipping info
 */
export interface ProductShipping {
  /** Weight in kg */
  weight: number;
  /** Dimensions in cm */
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  /** Free shipping eligibility */
  freeShipping: boolean;
  /** Shipping restrictions */
  restrictions?: string[];
}
