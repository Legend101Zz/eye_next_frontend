/**
 * Designer Settings Data Transfer Objects (DTOs)
 * Handle designer preferences and settings
 *
 * @module designer/dtos
 */

import { PayoutMethod } from "./types";

/**
 * Designer settings response DTO
 */
export interface DesignerSettingsDto {
  /** Designer ID */
  designerId: string;
  /** Privacy settings */
  privacy: {
    /** Profile visibility */
    profileVisibility: "public" | "private" | "followers";
    /** Show earnings */
    showEarnings: boolean;
    /** Show statistics */
    showStats: boolean;
    /** Show following list */
    showFollowing: boolean;
    /** Show design process */
    showProcess: boolean;
  };
  /** Notification settings */
  notifications: {
    /** Email notifications */
    email: {
      /** New orders */
      orders: boolean;
      /** New followers */
      followers: boolean;
      /** Reviews */
      reviews: boolean;
      /** Comments */
      comments: boolean;
      /** Promotions */
      promotions: boolean;
    };
    /** Push notifications */
    push: {
      /** New orders */
      orders: boolean;
      /** New followers */
      followers: boolean;
      /** Reviews */
      reviews: boolean;
      /** Comments */
      comments: boolean;
    };
  };
  /** Store settings */
  store: {
    /** Auto-approve products */
    autoApproveProducts: boolean;
    /** Default product visibility */
    defaultVisibility: "public" | "private" | "draft";
    /** Allowed product types */
    allowedProductTypes: string[];
    /** Price markup percentage */
    priceMarkup: number;
    /** Minimum price */
    minimumPrice: number;
  };
  /** Payout settings */
  payout: {
    /** Payout method */
    method: PayoutMethod;
    /** Minimum payout amount */
    minimumAmount: number;
    /** Auto payout */
    autoPayout: boolean;
    /** Payout schedule */
    schedule: "weekly" | "monthly";
    /** Tax information submitted */
    taxInfoSubmitted: boolean;
  };
  /** Collaboration settings */
  collaboration: {
    /** Accept collaborations */
    acceptCollaborations: boolean;
    /** Minimum commission percentage */
    minimumCommission: number;
    /** Automatic response message */
    autoResponse?: string;
  };
  /** API access settings */
  api: {
    /** API enabled */
    enabled: boolean;
    /** API keys */
    keys: Array<{
      /** Key ID */
      id: string;
      /** Key name */
      name: string;
      /** Creation date */
      createdAt: number;
      /** Last used date */
      lastUsedAt: number;
    }>;
  };
}

/**
 * Update designer settings request DTO
 */
export interface UpdateDesignerSettingsRequestDto {
  /** Privacy updates */
  privacy?: Partial<DesignerSettingsDto["privacy"]>;
  /** Notification updates */
  notifications?: Partial<DesignerSettingsDto["notifications"]>;
  /** Store updates */
  store?: Partial<DesignerSettingsDto["store"]>;
  /** Payout updates */
  payout?: Partial<DesignerSettingsDto["payout"]>;
  /** Collaboration updates */
  collaboration?: Partial<DesignerSettingsDto["collaboration"]>;
}
