/**
 * Shared types for Design DTOs
 * Contains common types and enums used across design-related DTOs
 *
 * @module design/dtos
 */

/**
 * Design visibility settings
 */
export enum DesignVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  UNLISTED = "unlisted",
}

/**
 * Design verification status
 */
export enum DesignVerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

/**
 * Design position on product
 */
export enum DesignPosition {
  FRONT = "front",
  BACK = "back",
  LEFT = "left",
  RIGHT = "right",
}

/**
 * Design file types that can be uploaded
 */
export enum DesignFileType {
  SVG = "svg",
  PNG = "png",
  JPEG = "jpeg",
  AI = "ai",
  PSD = "psd",
}

/**
 * Common design image structure
 */
export interface DesignImage {
  /** Image URL */
  url: string;
  /** Image width */
  width: number;
  /** Image height */
  height: number;
  /** File format */
  format: string;
  /** File size in bytes */
  size: number;
}

/**
 * Common design metadata structure
 */
export interface DesignMetadata {
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Design tags */
  tags: string[];
  /** Design categories */
  categories: string[];
  /** Color palette */
  colors: string[];
  /** Design style */
  style?: string;
}

/**
 * Common design verification structure
 */
export interface DesignVerification {
  /** Verification status */
  status: DesignVerificationStatus;
  /** Verification timestamp */
  verifiedAt?: number;
  /** Rejection reason if applicable */
  rejectionReason?: string;
}

/**
 * Common design visibility structure
 */
export interface DesignVisibilitySettings {
  /** Visibility status */
  status: DesignVisibility;
  /** Password if protected */
  isPasswordProtected: boolean;
  /** Allowed product types */
  allowedProducts: string[];
}

/**
 * Common design copyright structure
 */
export interface DesignCopyright {
  /** License type */
  license: string;
  /** Copyright holder */
  holder: string;
  /** Usage restrictions */
  restrictions?: string[];
}
