import { IBaseRepository } from "./IBaseRepository";
import { Design, DesignUsage, DesignImage } from "../../entities/design.entity";

/**
 * Query parameters for searching and filtering designs
 */
export interface DesignQueryParams {
  /** Search by title or description */
  search?: string;

  /** Filter by designer */
  designerId?: string;

  /** Filter by verification status */
  isVerified?: boolean;

  /** Filter by product category (where design is used) */
  productCategory?: string;

  /** Filter by usage count range */
  usageCount?: {
    min?: number;
    max?: number;
  };

  /** Date range filter */
  dateRange?: {
    start?: Date;
    end?: Date;
  };

  /** Sort options */
  sortBy?: "newest" | "popularity" | "title" | "usageCount";
  sortOrder?: "asc" | "desc";

  /** Pagination */
  page?: number;
  limit?: number;
}

/**
 * Paginated response interface
 */
export interface PaginatedDesigns {
  designs: Design[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Design Repository Interface
 */
export interface IDesignRepository extends IBaseRepository<Design> {
  /**
   * Find all designs with filtering and pagination
   *
   * @param params - Query parameters
   * @returns Promise resolving to paginated designs
   * @throws {ValidationError} If query parameters are invalid
   */
  findAll(params: DesignQueryParams): Promise<PaginatedDesigns>;

  /**
   * Find designs by designer
   *
   * @param designerId - ID of the designer
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated designs
   * @throws {NotFoundError} If designer doesn't exist
   */
  findByDesigner(
    designerId: string,
    params?: Omit<DesignQueryParams, "designerId">,
  ): Promise<PaginatedDesigns>;

  /**
   * Search designs
   *
   * @param query - Search query string
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated designs
   */
  search(
    query: string,
    params?: Omit<DesignQueryParams, "search">,
  ): Promise<PaginatedDesigns>;

  /**
   * Find design usage in final products
   *
   * @param designId - ID of the design
   * @returns Promise resolving to array of final products using this design
   * @throws {NotFoundError} If design doesn't exist
   */
  getDesignUsage(designId: string): Promise<DesignUsage[]>;

  /**
   * Verify a design
   *
   * @param designId - ID of the design
   * @returns Promise resolving to updated design
   * @throws {NotFoundError} If design doesn't exist
   */
  verifyDesign(designId: string): Promise<Design>;

  /**
   * Add design images
   *
   * @param designId - ID of the design
   * @param images - Array of images to add
   * @returns Promise resolving to updated design
   * @throws {NotFoundError} If design doesn't exist
   * @throws {ValidationError} If image data is invalid
   */
  addImages(
    designId: string,
    images: Omit<DesignImage, "id">[],
  ): Promise<Design>;

  /**
   * Get design statistics
   *
   * @param designId - ID of the design
   * @returns Promise resolving to statistics
   * @throws {NotFoundError} If design doesn't exist
   */
  getDesignStatistics(designId: string): Promise<{
    totalUsage: number;
    productCategories: { category: string; count: number }[];
    totalRevenue: number;
    popularPositions: { position: "front" | "back"; count: number }[];
  }>;

  /**
   * Find similar designs
   *
   * @param designId - ID of the design
   * @param limit - Maximum number of similar designs to return
   * @returns Promise resolving to array of similar designs
   */
  findSimilarDesigns(designId: string, limit?: number): Promise<Design[]>;

  /**
   * Get popular designs
   * Based on usage in final products
   *
   * @param params - Query parameters
   * @returns Promise resolving to paginated designs
   */
  getPopularDesigns(params?: DesignQueryParams): Promise<PaginatedDesigns>;

  /**
   * Find designs compatible with a product
   *
   * @param productId - ID of the base product
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated designs
   */
  findCompatibleWithProduct(
    productId: string,
    params?: DesignQueryParams,
  ): Promise<PaginatedDesigns>;

  /**
   * Track design usage in a final product
   *
   * @param designId - ID of the design
   * @param finalProductId - ID of the final product
   * @param usage - Usage details
   * @returns Promise resolving to updated design
   */
  trackDesignUsage(
    designId: string,
    finalProductId: string,
    usage: Omit<DesignUsage, "finalProductId">,
  ): Promise<Design>;
}
