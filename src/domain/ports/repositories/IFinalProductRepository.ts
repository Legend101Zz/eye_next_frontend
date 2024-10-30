import { IBaseRepository } from "./IBaseRepository";
import {
  Category,
  Color,
  Gender,
  Size,
} from "@/domain/entities/product.entity";
import {
  FinalProduct,
  CreateFinalProductData,
} from "@/domain/entities/finalProduct.entity";

/**
 * Query parameters for searching final products
 */
export interface FinalProductQueryParams {
  /** Text search in product name */
  search?: string;

  /** Filter by category */
  category?: Category;

  /** Filter by designer */
  designerId?: string;

  /** Filter by base product */
  baseProductId?: string;

  /** Filter by design */
  designId?: string;

  /** Filter by color */
  color?: Color;

  /** Filter by gender */
  gender?: Gender;

  /** Filter by sizes (for apparel) */
  sizes?: Size[];

  /** Price range filter */
  price?: {
    min?: number;
    max?: number;
  };

  /** Sales range filter */
  sales?: {
    min?: number;
    max?: number;
  };

  /** Date range filter */
  dateRange?: {
    start?: Date;
    end?: Date;
  };

  /** Sort options */
  sortBy?: "price" | "sales" | "newest" | "popularity";
  sortOrder?: "asc" | "desc";

  /** Pagination */
  page?: number;
  limit?: number;
}

/**
 * Paginated response for final products
 */
export interface PaginatedFinalProducts {
  products: FinalProduct[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Final Product Repository Interface
 */
export interface IFinalProductRepository extends IBaseRepository<FinalProduct> {
  /**
   * Create a new final product by applying designs to a base product
   *
   * @param data - Data required to create the final product
   * @returns Promise resolving to created final product
   * @throws {NotFoundError} If base product or designs don't exist
   * @throws {ValidationError} If data is invalid
   */
  createWithDesigns(data: CreateFinalProductData): Promise<FinalProduct>;

  /**
   * Find all final products with filtering and pagination
   *
   * @param params - Query parameters
   * @returns Promise resolving to paginated results
   */
  findAll(params: FinalProductQueryParams): Promise<PaginatedFinalProducts>;

  /**
   * Find products by designer
   *
   * @param designerId - ID of the designer
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated results
   */
  findByDesigner(
    designerId: string,
    params?: Omit<FinalProductQueryParams, "designerId">,
  ): Promise<PaginatedFinalProducts>;

  /**
   * Find products using a specific design
   *
   * @param designId - ID of the design
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated results
   */
  findByDesign(
    designId: string,
    params?: Omit<FinalProductQueryParams, "designId">,
  ): Promise<PaginatedFinalProducts>;

  /**
   * Find variants of a base product
   *
   * @param baseProductId - ID of the base product
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated results
   */
  findVariants(
    baseProductId: string,
    params?: Omit<FinalProductQueryParams, "baseProductId">,
  ): Promise<PaginatedFinalProducts>;

  /**
   * Get best selling products
   *
   * @param params - Query parameters
   * @returns Promise resolving to array of products
   */
  getBestSellers(
    params?: Partial<FinalProductQueryParams>,
  ): Promise<FinalProduct[]>;

  /**
   * Get trending products
   * Based on recent sales and views
   *
   * @param params - Query parameters
   * @returns Promise resolving to array of products
   */
  getTrending(
    params?: Partial<FinalProductQueryParams>,
  ): Promise<FinalProduct[]>;

  /**
   * Update product sales count
   *
   * @param productId - ID of the product
   * @param quantity - Quantity sold
   * @returns Promise resolving to updated product
   */
  updateSales(productId: string, quantity: number): Promise<FinalProduct>;

  /**
   * Get product analytics
   *
   * @param productId - ID of the product
   * @returns Promise resolving to analytics data
   */
  getAnalytics(productId: string): Promise<{
    totalSales: number;
    revenue: number;
    popularSizes?: { size: Size; count: number }[];
    salesByDate: { date: Date; sales: number }[];
    relatedProducts: string[];
  }>;

  /**
   * Find similar products
   *
   * @param productId - ID of the product
   * @param limit - Maximum number of products to return
   * @returns Promise resolving to array of similar products
   */
  findSimilar(productId: string, limit?: number): Promise<FinalProduct[]>;
}
