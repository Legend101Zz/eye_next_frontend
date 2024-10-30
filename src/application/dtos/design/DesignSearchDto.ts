/**
 * Data Transfer Object for design search queries
 * Used for filtering and searching designs
 *
 * @example
 * ```typescript
 * const searchDto: DesignSearchDto = {
 *   query: "summer",
 *   category: "t-shirt",
 *   tags: ["beach", "vacation"],
 *   sort: "popularity"
 * };
 * ```
 */
export interface DesignSearchDto {
  /** Search query string */
  query?: string;

  /** Filter by category */
  category?: string;

  /** Filter by designer */
  designerId?: string;

  /** Filter by tags */
  tags?: string[];

  /** Filter by color */
  colors?: string[];

  /** Filter by status */
  status?: ("draft" | "active" | "inactive")[];

  /** Date range filter */
  dateRange?: {
    start: Date;
    end: Date;
  };

  /** Sort options */
  sort?: {
    /** Sort field */
    field: "popularity" | "recent" | "sales" | "rating";
    /** Sort direction */
    direction: "asc" | "desc";
  };

  /** Pagination options */
  pagination?: {
    /** Page number */
    page: number;
    /** Items per page */
    limit: number;
  };

  /** Advanced filters */
  filters?: {
    /** Minimum rating */
    minRating?: number;
    /** Price range */
    priceRange?: {
      min: number;
      max: number;
    };
    /** Minimum sales */
    minSales?: number;
    /** Style attributes */
    styleAttributes?: string[];
  };
}

/**
 * Response type for paginated design searches
 */
export interface PaginatedDesignResponseDto {
  /** Design items */
  items: DesignResponseDto[];
  /** Total items count */
  total: number;
  /** Current page */
  page: number;
  /** Total pages */
  totalPages: number;
  /** Has more pages */
  hasMore: boolean;
  /** Search metadata */
  meta?: {
    /** Applied filters */
    filters: Record<string, any>;
    /** Sort settings */
    sort: Record<string, any>;
    /** Search timing */
    timing: {
      /** Search duration */
      duration: number;
      /** Cache hit */
      fromCache: boolean;
    };
  };
}
