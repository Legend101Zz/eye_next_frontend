/**
 * Shared types for Final Product DTOs
 * Contains common types and enums used across final product-related DTOs
 *
 * @module finalProduct/dtos
 */

/**
 * Final product status
 */
export enum FinalProductStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

/**
 * Design application position
 */
export enum DesignPosition {
  FRONT = "front",
  BACK = "back",
  LEFT_SLEEVE = "left_sleeve",
  RIGHT_SLEEVE = "right_sleeve",
  POCKET = "pocket",
  CUSTOM = "custom",
}

/**
 * Applied design information
 */
export interface AppliedDesign {
  /** Design ID */
  designId: string;
  /** Designer ID */
  designerId: string;
  /** Application position */
  position: DesignPosition;
  /** Design scale (0-1) */
  scale: number;
  /** Rotation in degrees */
  rotation: number;
  /** X offset (-1 to 1) */
  offsetX: number;
  /** Y offset (-1 to 1) */
  offsetY: number;
  /** Applied design image */
  appliedImage: {
    /** Preview URL */
    url: string;
    /** Image dimensions */
    dimensions: {
      width: number;
      height: number;
    };
  };
  /** Color modifications */
  colorModifications?: {
    /** Primary color */
    primary?: string;
    /** Secondary colors */
    secondary?: string[];
  };
}

/**
 * Price breakdown
 */
export interface PriceBreakdown {
  /** Base product price */
  basePrice: number;
  /** Design fee */
  designFee: number;
  /** Designer markup */
  designerMarkup: number;
  /** Platform fee */
  platformFee: number;
  /** Additional fees */
  additionalFees: {
    /** Fee name */
    name: string;
    /** Fee amount */
    amount: number;
  }[];
  /** Final price */
  finalPrice: number;
}

/**
 * Production details
 */
export interface ProductionDetails {
  /** Production method */
  method: "dtg" | "sublimation" | "embroidery" | "screen_print";
  /** Production time (hours) */
  productionTime: number;
  /** Special instructions */
  instructions?: string;
  /** Production constraints */
  constraints?: string[];
}
