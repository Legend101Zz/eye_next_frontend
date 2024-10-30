/**
 * Final Product Data Transfer Objects (DTOs)
 * Handle final product data transformations
 *
 * @module finalProduct/dtos
 */

import {
  FinalProductStatus,
  AppliedDesign,
  PriceBreakdown,
  ProductionDetails,
} from "./types";
import { ProductDto } from "../product/ProductDto";

/**
 * Final product response DTO
 * Complete final product information including base product and applied designs
 *
 * @example
 * ```typescript
 * const finalProduct: FinalProductDto = {
 *   id: "fp123",
 *   status: FinalProductStatus.ACTIVE,
 *   baseProduct: baseProductData,
 *   designs: [appliedDesignData]
 * };
 * ```
 */
export interface FinalProductDto {
  /** Final product unique identifier */
  id: string;
  /** Product title */
  title: string;
  /** Product status */
  status: FinalProductStatus;
  /** Base product information */
  baseProduct: {
    /** Base product ID */
    id: string;
    /** Product reference */
    product: Pick<ProductDto, "id" | "name" | "category" | "specifications">;
    /** Selected color */
    color: string;
    /** Available sizes */
    availableSizes: string[];
  };
  /** Applied designs */
  designs: AppliedDesign[];
  /** Designer information */
  designer: {
    /** Designer ID */
    id: string;
    /** Designer name */
    name: string;
    /** Profile image */
    profileImage?: string;
    /** Royalty percentage */
    royaltyPercentage: number;
  };
  /** Product images */
  images: {
    /** Primary image URL */
    primary: string;
    /** Additional views */
    views: {
      /** View position */
      position: string;
      /** Image URL */
      url: string;
    }[];
    /** Mockup previews */
    mockups: {
      /** Preview type */
      type: string;
      /** Preview URL */
      url: string;
    }[];
  };
  /** Pricing information */
  pricing: {
    /** Current price */
    currentPrice: number;
    /** Price breakdown */
    breakdown: PriceBreakdown;
    /** Bulk pricing tiers */
    bulkPricing?: {
      /** Minimum quantity */
      minQuantity: number;
      /** Price per unit */
      unitPrice: number;
    }[];
  };
  /** Production information */
  production: ProductionDetails;
  /** Inventory status */
  inventory: {
    /** Managed inventory */
    managed: boolean;
    /** Available quantity */
    available?: number;
    /** Reserved quantity */
    reserved?: number;
    /** Reorder point */
    reorderPoint?: number;
  };
  /** SEO metadata */
  seo: {
    /** Title */
    title: string;
    /** Description */
    description: string;
    /** Keywords */
    keywords: string[];
  };
  /** Product dates */
  dates: {
    /** Creation date */
    createdAt: number;
    /** Last update */
    updatedAt: number;
    /** Approval date */
    approvedAt?: number;
  };
}
