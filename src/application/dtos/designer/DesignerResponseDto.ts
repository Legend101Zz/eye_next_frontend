/**
 * Data Transfer Object for designer profile responses
 * Used for API responses and profile displays
 *
 * @example
 * ```typescript
 * const designerResponse: DesignerResponseDto = {
 *   id: "designer123",
 *   artistName: "DesignMaster",
 *   stats: { designs: 50, followers: 1000 }
 * };
 * ```
 */
export interface DesignerResponseDto {
  /** Designer ID */
  id: string;

  /** Basic information */
  basic: {
    /** Artist name */
    artistName: string;
    /** Biography */
    bio: string;
    /** Profile image URL */
    profileImageUrl: string;
    /** Cover image URL */
    coverImageUrl?: string;
    /** Verification status */
    isVerified: boolean;
    /** Join date */
    joinedAt: Date;
  };

  /** Professional information */
  professional: {
    /** Specializations */
    specializations: string[];
    /** Experience years */
    experience: number;
    /** Tools and software */
    tools: string[];
    /** Portfolio link */
    portfolioUrl?: string;
    /** Social media */
    socialLinks: Record<string, string>;
  };

  /** Statistics */
  stats: {
    /** Design count */
    designCount: number;
    /** Follower count */
    followers: number;
    /** Total sales */
    totalSales: number;
    /** Average rating */
    rating: number;
    /** Response time */
    responseTime: string;
  };

  /** Featured content */
  featured: {
    /** Featured designs */
    designs: Array<{
      /** Design ID */
      id: string;
      /** Design title */
      title: string;
      /** Preview URL */
      previewUrl: string;
      /** Sales count */
      sales: number;
    }>;
    /** Featured collections */
    collections: Array<{
      /** Collection ID */
      id: string;
      /** Collection name */
      name: string;
      /** Cover URL */
      coverUrl: string;
      /** Design count */
      designCount: number;
    }>;
  };

  /** Business metrics */
  business?: {
    /** Total revenue */
    totalRevenue: number;
    /** Active products */
    activeProducts: number;
    /** Average order value */
    averageOrderValue: number;
    /** Success rate */
    successRate: number;
  };

  /** Achievement badges */
  achievements: Array<{
    /** Badge ID */
    id: string;
    /** Badge name */
    name: string;
    /** Badge icon */
    icon: string;
    /** Earned date */
    earnedAt: Date;
  }>;
}
