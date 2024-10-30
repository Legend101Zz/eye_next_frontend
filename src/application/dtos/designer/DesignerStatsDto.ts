/**
 * Data Transfer Object for designer statistics and analytics
 * Used for dashboard and analytics views
 *
 * @example
 * ```typescript
 * const statsDto: DesignerStatsDto = {
 *   period: "monthly",
 *   sales: { total: 1500, growth: 10 },
 *   topDesigns: [...]
 * };
 * ```
 */
export interface DesignerStatsDto {
  /** Time period for stats */
  period: "daily" | "weekly" | "monthly" | "yearly";

  /** Sales statistics */
  sales: {
    /** Total sales amount */
    total: number;
    /** Growth percentage */
    growth: number;
    /** Sales by product type */
    byProduct: Record<string, number>;
    /** Sales by region */
    byRegion: Record<string, number>;
  };

  /** Earnings information */
  earnings: {
    /** Total earnings */
    total: number;
    /** Pending payments */
    pending: number;
    /** Monthly breakdown */
    monthly: {
      /** Month */
      month: string;
      /** Amount */
      amount: number;
    }[];
  };

  /** Design performance */
  designs: {
    /** Total designs */
    total: number;
    /** Active designs */
    active: number;
    /** Top performing designs */
    topPerforming: Array<{
      /** Design ID */
      id: string;
      /** Design name */
      name: string;
      /** Sales count */
      sales: number;
      /** Revenue generated */
      revenue: number;
    }>;
  };

  /** Audience metrics */
  audience: {
    /** Total followers */
    followers: number;
    /** Follower growth */
    followerGrowth: number;
    /** Profile views */
    profileViews: number;
    /** Design views */
    designViews: number;
    /** Engagement rate */
    engagementRate: number;
  };

  /** Customer insights */
  customers: {
    /** Total customers */
    total: number;
    /** Returning customers percentage */
    returningRate: number;
    /** Average order value */
    averageOrderValue: number;
    /** Customer demographics */
    demographics: {
      /** Age groups */
      age: Record<string, number>;
      /** Regions */
      region: Record<string, number>;
    };
  };
}
