/**
 * Final Product Update DTOs
 * Handle final product update requests
 *
 * @module finalProduct/dtos
 */

import { FinalProductStatus, DesignPosition, ProductionDetails } from "./types";

/**
 * Update final product request DTO
 */
export interface UpdateFinalProductDto {
  /** Title update */
  title?: string;
  /** Status update */
  status?: FinalProductStatus;
  /** Design updates */
  designs?: Array<{
    /** Design ID */
    designId: string;
    /** Position update */
    position?: DesignPosition;
    /** Scale update */
    scale?: number;
    /** Rotation update */
    rotation?: number;
    /** Offset updates */
    offsetX?: number;
    offsetY?: number;
    /** Color updates */
    colors?: {
      primary?: string;
      secondary?: string[];
    };
  }>;
  /** Pricing updates */
  pricing?: {
    /** Base price update */
    basePrice?: number;
    /** Designer markup update */
    designerMarkup?: number;
    /** Additional fees */
    additionalFees?: Array<{
      name: string;
      amount: number;
    }>;
  };
  /** Production updates */
  production?: Partial<ProductionDetails>;
  /** Inventory updates */
  inventory?: {
    /** Available quantity */
    available?: number;
    /** Reorder point */
    reorderPoint?: number;
  };
  /** SEO updates */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * Bulk update request DTO
 */
export interface BulkUpdateFinalProductDto {
  /** Product IDs to update */
  productIds: string[];
  /** Updates to apply */
  updates: Partial<UpdateFinalProductDto>;
}

/**
 * Status update request DTO
 */
export interface UpdateFinalProductStatusDto {
  /** New status */
  status: FinalProductStatus;
  /** Update reason */
  reason?: string;
  /** Reviewer notes */
  notes?: string;
}
