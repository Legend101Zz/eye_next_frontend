/**
 * Final Product Statistics DTOs
 * Handle final product analytics and statistics
 *
 * @module finalProduct/dtos
 */

/**
 * Final product statistics response DTO
 */
export interface FinalProductStatsDto {
  /** Product ID */
  productId: string;
  /** Overview metrics */
  overview: {
    /** Total views */
    totalViews: number;
    /** Total orders */
    totalOrders: number;
    /** Total revenue */
    totalRevenue: number;
    /** Average rating */
    averageRating: number;
    /** Total reviews */
    totalReviews: number;
  };
  /** Sales data */
  sales: {
    /** Sales by period */
    byPeriod: Array<{
      /** Period start */
      date: number;
      /** Units sold */
      units: number;
      /** Revenue */
      revenue: number;
    }>;
    /** Sales by variant */
    byVariant: Array<{
      /** Color variant */
      color: string;
      /** Size variant */
      size: string;
      /** Units sold */
      units: number;
      /** Revenue */
      revenue: number;
    }>;
    /** Sales by region */
    byRegion: Record<
      string,
      {
        units: number;
        revenue: number;
      }
    >;
  };
  /** Performance metrics */
  performance: {
    /** Conversion rate */
    conversionRate: number;
    /** Cart addition rate */
    cartAdditionRate: number;
    /** Wishlist addition rate */
    wishlistRate: number;
    /** Share rate */
    shareRate: number;
    /** Return rate */
    returnRate: number;
  };
  /** Customer data */
  customers: {
    /** Repeat purchase rate */
    repeatPurchaseRate: number;
    /** Customer satisfaction */
    satisfaction: number;
    /** Demographics */
    demographics: {
      /** Age groups */
      ageGroups: Record<string, number>;
      /** Gender distribution */
      gender: Record<string, number>;
      /** Location distribution */
      locations: Record<string, number>;
    };
  };
  /** Designer earnings */
  designerEarnings: {
    /** Total earnings */
    total: number;
    /** Earnings by period */
    byPeriod: Array<{
      /** Period start */
      date: number;
      /** Amount earned */
      amount: number;
    }>;
  };
  /** Production metrics */
  production: {
    /** Average production time */
    averageProductionTime: number;
    /** Defect rate */
    defectRate: number;
    /** Production costs */
    costs: {
      /** Cost per unit */
      perUnit: number;
      /** Total costs */
      total: number;
    };
  };
}

/**
 * Statistics request DTO
 */
export interface FinalProductStatsRequestDto {
  /** Time range */
  timeRange: {
    /** Start date */
    start: number;
    /** End date */
    end: number;
  };
  /** Metrics to include */
  metrics?: string[];
  /** Grouping period */
  groupBy?: "day" | "week" | "month";
  /** Include comparisons */
  includeComparisons?: boolean;
}
