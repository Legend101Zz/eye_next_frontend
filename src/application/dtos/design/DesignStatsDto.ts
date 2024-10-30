/**
 * Design Statistics Data Transfer Objects (DTOs)
 * These DTOs handle design analytics and statistics
 *
 * @module design/dtos
 */

/**
 * Design statistics response DTO
 * Represents complete statistics for a design
 *
 * @example
 * ```typescript
 * const stats: DesignStatsDto = {
 *   id: "design123",
 *   views: {
 *     total: 1000,
 *     unique: 750
 *   }
 * };
 * ```
 */
export interface DesignStatsDto {
  /** Design ID */
  id: string;
  /** View statistics */
  views: {
    /** Total views count */
    total: number;
    /** Unique viewers count */
    unique: number;
    /** View trend by period */
    trend: {
      /** Time period */
      period: string;
      /** View count */
      count: number;
    }[];
  };
  /** Usage statistics */
  usage: {
    /** Times used in products */
    totalApplications: number;
    /** Products using design */
    products: {
      /** Product ID */
      id: string;
      /** Product name */
      name: string;
      /** Usage count */
      usageCount: number;
    }[];
    /** Popular positions */
    popularPositions: {
      /** Position on product */
      position: string;
      /** Usage count */
      count: number;
    }[];
  };
  /** Sales statistics */
  sales: {
    /** Total sales count */
    totalSales: number;
    /** Total revenue */
    totalRevenue: number;
    /** Sales by product */
    byProduct: {
      /** Product ID */
      id: string;
      /** Product name */
      name: string;
      /** Sales count */
      sales: number;
      /** Revenue generated */
      revenue: number;
    }[];
    /** Sales trend */
    trend: {
      /** Time period */
      period: string;
      /** Sales count */
      sales: number;
      /** Revenue */
      revenue: number;
    }[];
  };
  /** Performance metrics */
  performance: {
    /** Conversion rate */
    conversionRate: number;
    /** Average rating */
    averageRating: number;
    /** Total reviews */
    totalReviews: number;
    /** Click-through rate */
    ctr: number;
    /** Favorited count */
    favorites: number;
  };
  /** Designer earnings */
  earnings: {
    /** Total earnings */
    total: number;
    /** Earnings by period */
    byPeriod: {
      /** Time period */
      period: string;
      /** Amount earned */
      amount: number;
    }[];
    /** Pending payouts */
    pending: number;
    /** Last payout */
    lastPayout?: {
      /** Amount paid */
      amount: number;
      /** Payment date */
      date: number;
    };
  };
}

/**
 * Design analytics request DTO
 * Used when requesting specific analytics
 */
export interface DesignAnalyticsRequestDto {
  /** Design ID */
  designId: string;
  /** Time range */
  timeRange: {
    /** Start date */
    start: number;
    /** End date */
    end: number;
  };
  /** Metrics to include */
  metrics: string[];
  /** Grouping period */
  groupBy?: "day" | "week" | "month";
  /** Include comparison with previous period */
  comparison?: boolean;
}

/**
 * Design performance metrics DTO
 * Contains key performance indicators
 */
export interface DesignPerformanceMetricsDto {
  /** Design ID */
  id: string;
  /** Time period */
  period: {
    start: number;
    end: number;
  };
  /** Key metrics */
  metrics: {
    /** Views */
    views: number;
    /** Sales */
    sales: number;
    /** Revenue */
    revenue: number;
    /** Conversion rate */
    conversionRate: number;
    /** Average rating */
    rating: number;
  };
  /** Comparison with previous period */
  comparison?: {
    /** Views change */
    viewsChange: number;
    /** Sales change */
    salesChange: number;
    /** Revenue change */
    revenueChange: number;
  };
}
