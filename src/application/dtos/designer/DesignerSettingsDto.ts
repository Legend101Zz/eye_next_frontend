/**
 * Data Transfer Object for designer settings
 * Controls visibility and preferences for designer profile
 *
 * @example
 * ```typescript
 * const settingsDto: DesignerSettingsDto = {
 *   isPrivate: false,
 *   showFollowers: true,
 *   featuredDesigns: ["design1", "design2"]
 * };
 * ```
 */
export interface DesignerSettingsDto {
  /** Profile privacy setting */
  isPrivate: boolean;

  /** Display preferences */
  display: {
    /** Show follower count */
    showFollowers: boolean;
    /** Show earnings */
    showEarnings: boolean;
    /** Show design count */
    showDesignCount: boolean;
    /** Show sale statistics */
    showStats: boolean;
  };

  /** Content settings */
  content: {
    /** Featured designs IDs */
    featuredDesigns: string[];
    /** Pinned collections */
    pinnedCollections: string[];
    /** Showcase order */
    showcaseOrder: ("designs" | "collections" | "about")[];
  };

  /** Notification preferences */
  notifications: {
    /** Email notifications */
    email: {
      /** New orders */
      orders: boolean;
      /** Design approvals */
      approvals: boolean;
      /** Comments */
      comments: boolean;
      /** Followers */
      followers: boolean;
    };
    /** Push notifications */
    push: {
      /** New orders */
      orders: boolean;
      /** Messages */
      messages: boolean;
      /** Reviews */
      reviews: boolean;
    };
  };

  /** Store settings */
  store: {
    /** Default currency */
    currency: string;
    /** Automatic approval of orders */
    autoApproveOrders: boolean;
    /** Minimum order amount */
    minimumOrderAmount?: number;
    /** Bulk order discounts */
    bulkDiscounts?: Array<{
      quantity: number;
      percentage: number;
    }>;
  };
}
