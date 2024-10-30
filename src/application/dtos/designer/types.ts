/**
 * Shared types for Designer DTOs
 * Contains common types and enums used across designer-related DTOs
 *
 * @module designer/dtos
 */

/**
 * Designer account status
 */
export enum DesignerStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  BANNED = "banned",
}

/**
 * Designer verification level
 */
export enum VerificationLevel {
  NONE = "none",
  BASIC = "basic",
  VERIFIED = "verified",
  PREMIUM = "premium",
}

/**
 * Designer payout method
 */
export enum PayoutMethod {
  BANK_TRANSFER = "bank_transfer",
  PAYPAL = "paypal",
  STRIPE = "stripe",
}

/**
 * Common designer profile image structure
 */
export interface DesignerImage {
  /** Image URL */
  url: string;
  /** Upload timestamp */
  uploadedAt: number;
  /** Image type (profile, cover, etc.) */
  type: "profile" | "cover" | "banner";
}

/**
 * Common designer social links structure
 */
export interface SocialLinks {
  /** Website URL */
  website?: string;
  /** Instagram handle */
  instagram?: string;
  /** Twitter handle */
  twitter?: string;
  /** Behance URL */
  behance?: string;
  /** Other social links */
  [key: string]: string | undefined;
}

/**
 * Common designer address structure
 */
export interface DesignerAddress {
  /** Address type */
  type: "business" | "payout" | "shipping";
  /** Street line 1 */
  street1: string;
  /** Street line 2 */
  street2?: string;
  /** City */
  city: string;
  /** State/Province */
  state: string;
  /** Postal code */
  postalCode: string;
  /** Country code */
  country: string;
}

/**
 * Common designer legal info structure
 */
export interface LegalInfo {
  /** Business name */
  businessName?: string;
  /** Tax ID */
  taxId?: string;
  /** VAT number */
  vatNumber?: string;
  /** Business type */
  businessType?: string;
}

/**
 * Common designer stats structure
 */
export interface DesignerStats {
  /** Total followers */
  followers: number;
  /** Total designs */
  designs: number;
  /** Total sales */
  sales: number;
  /** Average rating */
  rating: number;
}
