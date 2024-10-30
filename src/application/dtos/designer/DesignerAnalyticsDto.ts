/**
 * Designer Analytics Data Transfer Objects (DTOs)
 * Handle designer performance and analytics data
 *
 * @module designer/dtos
 */

/**
 * Designer analytics response DTO
 */
export interface DesignerAnalyticsDto {
  /** Designer ID */
  designerId: string;
  /** Time period */
  period: {
    /** Start date */
    start: number;
    /** End date */
    end: number;
  };
  /** Overview metrics */
  overview: {
    /** Total revenue */
    totalRevenue: number;
    /** Total orders */
    totalOrders: number;
    /** Average order value */
    averageOrderValue: number;
    /** Total designs sold */
    designsSold: number;
    /** New followers */
    newFollowers: number;
  };
  /** Revenue analytics */
  revenue: {
    /** Revenue by period */
    byPeriod: Array<{
      /** Period start */
      date: number;
      /** Revenue amount */
      amount: number;
      /** Order count */
      orders: number;
    }>;
    /** Revenue by product */
    byProduct: Array<{
      /** Product ID */
      productId: string;
      /** Product name */
      name: string;
      /** Revenue amount */
      amount: number;
      /** Units sold */
      units: number;
    }>;
    /** Revenue by category */
    byCategory: Array<{
      /** Category name */
      category: string;
      /** Revenue amount */
      amount: number;
      /** Percentage of total */
      percentage: number;
    }>;
  };
  /** Design performance */
  designs: {
    /** Top performing designs */
    topDesigns: Array<{
      /** Design ID */
      designId: string;
      /** Design name */
      name: string;
      /** Revenue generated */
      revenue: number;
      /** Units sold */
      sales: number;
      /** View count */
      views: number;
      /** Conversion rate */
      conversionRate: number;
    }>;
    /** Design engagement */
    engagement: {
      /** Total views */
      totalViews: number;
      /** Average time viewed */
      averageTimeViewed: number;
      /** Save rate */
      saveRate: number;
      /** Share count */
      shares: number;
    };
  };
  /** Customer analytics */
  customers: {
    /** Customer demographics */
    demographics: {
      /** Age groups */
      ageGroups: Record<string, number>;
      /** Locations */
      locations: Record<string, number>;
      /** Gender distribution */
      gender: Record<string, number>;
    };
    /** Customer behavior */
    behavior: {
      /** Repeat purchase rate */
      repeatPurchaseRate: number;
      /** Average customer lifetime value */
      averageLifetimeValue: number;
      /** Customer satisfaction score */
      satisfactionScore: number;
    };
  };
  /** Marketing performance */
  marketing: {
    /** Traffic sources */
    trafficSources: Record<string, number>;
    /** Conversion rates */
    conversionRates: {
      /** Overall rate */
      overall: number;
      /** By source */
      bySource: Record<string, number>;
    };
    /** Campaign performance */
    campaigns: Array<{
      /** Campaign ID */
      id: string;
      /** Campaign name */
      name: string;
      /** Views */
      views: number;
      /** Conversions */
      conversions: number;
      /** Revenue attributed */
      revenue: number;
    }>;
  };
}

/**
 * Analytics request DTO
 */
export interface DesignerAnalyticsRequestDto {
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
  /** Filters */
  filters?: {
    /** Product categories */
    categories?: string[];
    /** Price range */
    priceRange?: {
      min: number;
      max: number;
    };
    /** Customer segments */
    customerSegments?: string[];
  };
}
