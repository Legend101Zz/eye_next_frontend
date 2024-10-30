/**
 * Final Product Create DTOs
 * Handle final product creation requests
 *
 * @module finalProduct/dtos
 */

import { DesignPosition, ProductionDetails } from "./types";

/**
 * Create final product request DTO
 *
 * @example
 * ```typescript
 * const createRequest: CreateFinalProductDto = {
 *   baseProductId: "prod123",
 *   title: "Mountain Sunset Tee",
 *   designs: [{
 *     designId: "design123",
 *     position: DesignPosition.FRONT
 *   }]
 * };
 * ```
 */
export interface CreateFinalProductDto {
  /** Base product ID */
  baseProductId: string;
  /** Product title */
  title: string;
  /** Design applications */
  designs: Array<{
    /** Design ID */
    designId: string;
    /** Application position */
    position: DesignPosition;
    /** Scale factor */
    scale?: number;
    /** Rotation */
    rotation?: number;
    /** X offset */
    offsetX?: number;
    /** Y offset */
    offsetY?: number;
    /** Color modifications */
    colors?: {
      primary?: string;
      secondary?: string[];
    };
  }>;
  /** Selected color */
  color: string;
  /** Available sizes */
  sizes?: string[];
  /** Pricing options */
  pricing?: {
    /** Base price override */
    basePrice?: number;
    /** Designer markup */
    designerMarkup?: number;
    /** Additional fees */
    additionalFees?: {
      name: string;
      amount: number;
    }[];
  };
  /** Production details */
  production?: ProductionDetails;
  /** SEO metadata */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * Bulk creation request DTO
 */
export interface BulkCreateFinalProductDto {
  /** Base product ID */
  baseProductId: string;
  /** Color variants */
  colors: string[];
  /** Design applications */
  designs: Array<{
    designId: string;
    position: DesignPosition;
  }>;
  /** Base title template */
  titleTemplate: string;
}
