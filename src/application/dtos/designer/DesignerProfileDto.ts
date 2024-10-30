/**
 * Designer Profile Data Transfer Objects (DTOs)
 * Handle designer profile data transformations
 *
 * @module designer/dtos
 */

import {
  DesignerStatus,
  VerificationLevel,
  DesignerImage,
  SocialLinks,
  DesignerAddress,
  LegalInfo,
  DesignerStats,
} from "./types";

/**
 * Designer profile response DTO
 * Complete designer profile information
 *
 * @example
 * ```typescript
 * const profile: DesignerProfileDto = {
 *   id: "designer123",
 *   artistName: "Mountain Arts",
 *   status: DesignerStatus.ACTIVE
 * };
 * ```
 */
export interface DesignerProfileDto {
  /** Designer unique identifier */
  id: string;
  /** Associated user ID */
  userId: string;
  /** Artist/brand name */
  artistName: string;
  /** Account status */
  status: DesignerStatus;
  /** Verification level */
  verificationLevel: VerificationLevel;
  /** Profile images */
  images: {
    profile?: DesignerImage;
    cover?: DesignerImage;
    banner?: DesignerImage;
  };
  /** Bio/Description */
  bio: {
    /** Short description */
    short?: string;
    /** Full biography */
    full?: string;
    /** Specialties/Skills */
    specialties: string[];
  };
  /** Contact information */
  contact: {
    /** Public email */
    publicEmail?: string;
    /** Business phone */
    phone?: string;
    /** Contact hours */
    hours?: string;
    /** Response time in hours */
    responseTime?: number;
  };
  /** Social media links */
  social: SocialLinks;
  /** Business information */
  business: {
    /** Legal information */
    legal: LegalInfo;
    /** Business address */
    address: DesignerAddress;
  };
  /** Portfolio information */
  portfolio: {
    /** Featured designs */
    featuredDesigns: string[];
    /** Collections */
    collections: Array<{
      id: string;
      name: string;
      designCount: number;
    }>;
    /** Portfolio links */
    links: string[];
  };
  /** Statistics */
  stats: DesignerStats;
  /** Account dates */
  dates: {
    /** Join date */
    joinedAt: number;
    /** Last active timestamp */
    lastActiveAt: number;
    /** Verification date */
    verifiedAt?: number;
  };
}

/**
 * Update designer profile request DTO
 */
export interface UpdateDesignerProfileRequestDto {
  /** Artist name update */
  artistName?: string;
  /** Bio updates */
  bio?: {
    short?: string;
    full?: string;
    specialties?: string[];
  };
  /** Contact updates */
  contact?: {
    publicEmail?: string;
    phone?: string;
    hours?: string;
  };
  /** Social links updates */
  social?: Partial<SocialLinks>;
  /** Business info updates */
  business?: {
    legal?: Partial<LegalInfo>;
    address?: Partial<DesignerAddress>;
  };
}

/**
 * Designer profile validation DTO
 */
export interface DesignerProfileValidationDto {
  /** Validation issues */
  issues: Array<{
    /** Field with issue */
    field: string;
    /** Issue message */
    message: string;
    /** Severity level */
    severity: "error" | "warning" | "info";
  }>;
  /** Completion percentage */
  completionPercentage: number;
  /** Required fields status */
  requiredFields: {
    /** Field name */
    field: string;
    /** Completion status */
    completed: boolean;
  }[];
}
