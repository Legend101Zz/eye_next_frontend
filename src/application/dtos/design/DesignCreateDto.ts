/**
 * Data Transfer Object for creating a new design
 * Used when designers upload new designs
 * Integrates with StorageService for file handling
 *
 * @example
 * ```typescript
 * const createDto: DesignCreateDto = {
 *   title: "Summer Collection Design",
 *   designFile: File,
 *   category: "t-shirt",
 *   colors: ["#FF0000", "#00FF00"],
 *   tags: ["summer", "casual"]
 * };
 * ```
 */
export interface DesignCreateDto {
  /** Design title */
  title: string;

  /** Description of the design */
  description?: string;

  /** Design file (image) */
  designFile: File;

  /** Designer ID who created the design */
  designerId: string;

  /** Design category */
  category: string;

  /** Primary colors used in design */
  colors?: string[];

  /** Design style tags */
  tags?: string[];

  /** Design rendering preferences */
  renderPreferences?: {
    /** Default position on product */
    defaultPosition: "front" | "back";
    /** Whether design can be resized */
    allowResize: boolean;
    /** Whether design can be recolored */
    allowRecolor: boolean;
    /** Minimum dimensions */
    minDimensions?: {
      width: number;
      height: number;
    };
    /** Maximum dimensions */
    maxDimensions?: {
      width: number;
      height: number;
    };
  };

  /** Design price settings */
  pricing?: {
    /** Base price for the design */
    basePrice: number;
    /** Bulk pricing tiers */
    bulkPricing?: Array<{
      quantity: number;
      price: number;
    }>;
    /** Designer royalty percentage */
    royaltyPercentage?: number;
  };

  /** Intellectual property information */
  ipRights?: {
    /** Copyright information */
    copyright?: string;
    /** License type */
    license: "standard" | "exclusive" | "custom";
    /** Usage restrictions */
    restrictions?: string[];
  };
}
