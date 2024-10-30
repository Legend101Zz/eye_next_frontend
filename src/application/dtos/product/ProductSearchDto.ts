/**
 * Product Search Data Transfer Objects (DTOs)
 * Handle product search and filtering
 *
 * @module product/dtos
 */

import { ProductCategory, ProductGender, SizeType } from "./types";

/**
 * Product search request DTO
 */
export interface ProductSearchRequestDto {
  /** Search query */
  query?: string;
  /** Filters */
  filters?: {
    /** Categories */
    categories?: ProductCategory[];
    /** Gender filter */
    gender?: ProductGender[];
    /** Size types */
    sizeTypes?: SizeType[];
    /** Price range */
    price?: {
      min?: number;
      max?: number;
    };
    /** Stock status */
    inStock?: boolean;
    /** On sale only */
    onSale?: boolean;
    /** Tags */
    tags?: string[];
    /** Custom filters */
    [key: string]: any;
  };
  /** Sorting */
  sort?: {
    /** Sort field */
    field: "price" | "name" | "created" | "popularity";
    /** Sort direction */
    direction: "asc" | "desc";
  };
  /** Pagination */
  pagination: {
    /** Page number */
    page: number;
    /** Items per page */
    limit: number;
  };
}

/**
 * Product search response DTO
 */
export interface ProductSearchResponseDto {
  /** Search results */
  results: Array<{
    /** Product ID */
    id: string;
    /** Product name */
    name: string;
    /** Product category */
    category: ProductCategory;
    /** Primary image */
    image: string;
    /** Current price */
    price: number;
    /** Sale status */
    onSale: boolean;
    /** Stock status */
    inStock: boolean;
    /** Relevance score */
    score?: number;
  }>;
  /** Facets/aggregations */
  facets: {
    /** Category counts */
    categories: Record<ProductCategory, number>;
    /** Gender counts */
    gender: Record<ProductGender, number>;
    /** Price ranges */
    priceRanges: Array<{
      min: number;
      max: number;
      count: number;
    }>;
    /** Tag counts */
    tags: Record<string, number>;
  };
  /** Pagination info */
  pagination: {
    /** Current page */
    page: number;
    /** Total pages */
    totalPages: number;
    /** Total results */
    total: number;
    /** Has more pages */
    hasMore: boolean;
  };
  /** Search metadata */
  metadata: {
    /** Search time in ms */
    took: number;
    /** Applied filters */
    appliedFilters: string[];
    /** Suggested queries */
    suggestions?: string[];
  };
}
