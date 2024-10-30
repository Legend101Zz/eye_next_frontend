/**
 * Design Data Transfer Objects (DTOs)
 * These DTOs handle core design data transformations between
 * the presentation and domain layers.
 *
 * @module design/dtos
 */

import {
  DesignVisibility,
  DesignVerificationStatus,
  DesignMetadata,
  DesignVerification,
  DesignVisibilitySettings,
  DesignCopyright,
  DesignImage,
} from "./types";

/**
 * Base design response DTO
 * Contains common design properties
 */
export interface DesignResponseDto {
  /** Design unique identifier */
  id: string;
  /** Design title */
  title: string;
  /** Design description */
  description?: string;
  /** Design images */
  images: {
    /** Original design file */
    original: DesignImage;
    /** Preview image */
    preview: DesignImage;
    /** Thumbnail */
    thumbnail: DesignImage;
  };
  /** Designer information */
  designer: {
    /** Designer ID */
    id: string;
    /** Designer name */
    name: string;
    /** Designer profile picture */
    profilePicture?: string;
  };
  /** Design metadata */
  metadata: DesignMetadata;
  /** Verification information */
  verification: DesignVerification;
  /** Visibility settings */
  visibility: DesignVisibilitySettings;
  /** Copyright information */
  copyright: DesignCopyright;
}

/**
 * Create design request DTO
 * Used when creating a new design
 *
 * @example
 * ```typescript
 * const createRequest: CreateDesignRequestDto = {
 *   title: "Mountain Sunset",
 *   description: "Beautiful mountain landscape",
 *   tags: ["nature", "mountains"]
 * };
 * ```
 */
export interface CreateDesignRequestDto {
  /** Design title */
  title: string;
  /** Design description */
  description?: string;
  /** Design tags */
  tags?: string[];
  /** Design categories */
  categories?: string[];
  /** Visibility settings */
  visibility?: DesignVisibility;
  /** Allowed product types */
  allowedProducts?: string[];
  /** Copyright information */
  copyright?: {
    license: string;
    restrictions?: string[];
  };
}

/**
 * Update design request DTO
 * Used when updating design information
 */
export interface UpdateDesignRequestDto {
  /** Updated title */
  title?: string;
  /** Updated description */
  description?: string;
  /** Updated tags */
  tags?: string[];
  /** Updated categories */
  categories?: string[];
  /** Updated visibility */
  visibility?: DesignVisibility;
  /** Updated product permissions */
  allowedProducts?: string[];
}

/**
 * Delete design request DTO
 * Used when deleting a design
 */
export interface DeleteDesignRequestDto {
  /** Reason for deletion */
  reason?: string;
  /** Whether to delete all associated products */
  deleteProducts?: boolean;
  /** Whether to notify customers */
  notifyCustomers?: boolean;
}
