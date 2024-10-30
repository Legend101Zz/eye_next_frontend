/**
 * Data Transfer Object for design responses
 * Used for API responses and client-side state
 * Includes all necessary design information for display
 *
 * @example
 * ```typescript
 * const designResponse: DesignResponseDto = {
 *   id: "design123",
 *   title: "Summer Design",
 *   imageUrls: {
 *     original: "url",
 *     thumbnail: "url"
 *   },
 *   status: "active"
 * };
 * ```
 */
export interface DesignResponseDto {
  /** Design unique identifier */
  id: string;

  /** Design title */
  title: string;

  /** Design description */
  description?: string;

  /** Various image URLs for different contexts */
  imageUrls: {
    /** Original image URL */
    original: string;
    /** Thumbnail URL */
    thumbnail: string;
    /** Preview URL */
    preview: string;
    /** High-resolution URL */
    highRes?: string;
    /** Transparent background version */
    transparent?: string;
  };

  /** Designer information */
  designer: {
    /** Designer ID */
    id: string;
    /** Designer name */
    name: string;
    /** Designer avatar */
    avatarUrl?: string;
    /** Verification status */
    isVerified: boolean;
  };

  /** Design metadata */
  metadata: {
    /** Creation date */
    createdAt: Date;
    /** Last update date */
    updatedAt: Date;
    /** View count */
    views: number;
    /** Usage count */
    usages: number;
    /** Like count */
    likes: number;
    /** Version information */
    version: string;
  };

  /** Design status */
  status: "draft" | "pending" | "active" | "inactive" | "rejected";

  /** Approval information if applicable */
  approval?: {
    /** Approval status */
    status: "pending" | "approved" | "rejected";
    /** Approval date */
    date?: Date;
    /** Reviewer notes */
    notes?: string;
    /** Rejection reason */
    rejectionReason?: string;
  };

  /** Design statistics */
  stats: {
    /** Total sales */
    totalSales: number;
    /** Revenue generated */
    revenue: number;
    /** Rating information */
    rating: {
      /** Average rating */
      average: number;
      /** Total ratings */
      count: number;
    };
  };

  /** Technical specifications */
  specifications: {
    /** File format */
    format: string;
    /** Dimensions */
    dimensions: {
      width: number;
      height: number;
    };
    /** File size */
    fileSize: number;
    /** Color mode */
    colorMode: "RGB" | "CMYK";
    /** DPI */
    dpi: number;
  };

  /** Available products */
  availableProducts: Array<{
    /** Product ID */
    id: string;
    /** Product name */
    name: string;
    /** Product category */
    category: string;
    /** Preview URL with design */
    previewUrl: string;
  }>;
}
