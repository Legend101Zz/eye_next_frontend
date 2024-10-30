import { IBaseRepository } from "./IBaseRepository";
import {
  Product,
  Gender,
  Color,
  Category,
  Size,
} from "@/domain/entities/product.entity";
/**
 * Product Query Parameters
 * Defines all possible parameters for filtering, sorting, and paginating products
 */
export interface ProductQueryParams {
  /** Filter by product category */
  category?: Category;

  /** Search text to filter products by name or description */
  search?: string;

  /** Minimum price filter */
  minPrice?: number;

  /** Maximum price filter */
  maxPrice?: number;

  /** Field to sort results by */
  sortBy?: "price" | "popularity" | "newest";

  /** Sort order direction */
  sortOrder?: "asc" | "desc";

  /** Page number for pagination (1-based) */
  page?: number;

  /** Number of items per page */
  limit?: number;

  /** Filter by gender */
  gender?: Gender;

  /** Filter by available sizes */
  sizes?: Size[];

  /** Filter by colors */
  colors?: Color[];

  /** Filter by stock status */
  inStock?: boolean;
}

/**
 * Paginated response interface for product queries
 */
export interface PaginatedProducts {
  /** Array of products matching the query */
  products: Product[];

  /** Total number of products matching the query (before pagination) */
  total: number;

  /** Current page number */
  page: number;

  /** Total number of pages available */
  totalPages: number;

  /** Number of items per page */
  limit: number;

  /** Has more pages flag */
  hasMore: boolean;
}

/**
 * Product Repository Interface
 * Extends the base repository with product-specific operations
 */
export interface IProductRepository extends IBaseRepository<Product> {
  /**
   * Find all products with filtering, sorting, and pagination
   *
   * @param params - Query parameters for filtering, sorting, and pagination
   * @returns Promise resolving to paginated products result
   * @throws {ValidationError} If query parameters are invalid
   * @throws {DatabaseError} If the query fails
   *
   * @example
   * ```typescript
   * const result = await productRepo.findAll({
   *   category: 'hoodie',
   *   minPrice: 20,
   *   maxPrice: 100,
   *   sortBy: 'price',
   *   sortOrder: 'asc',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  findAll(params: ProductQueryParams): Promise<PaginatedProducts>;

  /**
   * Find products by category
   *
   * @param category - The product category to filter by
   * @returns Promise resolving to array of matching products
   * @throws {ValidationError} If category is invalid
   * @throws {DatabaseError} If the query fails
   */
  findByCategory(category: Category): Promise<Product[]>;

  /**
   * Find latest products
   *
   * @param limit - Maximum number of products to return (default: 10)
   * @returns Promise resolving to array of latest products
   * @throws {ValidationError} If limit is invalid
   * @throws {DatabaseError} If the query fails
   */
  findLatest(limit?: number): Promise<Product[]>;

  /**
   * Find best selling products
   *
   * @param limit - Maximum number of products to return (default: 10)
   * @returns Promise resolving to array of best selling products
   * @throws {ValidationError} If limit is invalid
   * @throws {DatabaseError} If the query fails
   */
  findBestSellers(limit?: number): Promise<Product[]>;

  /**
   * Find products by designer
   *
   * @param designerId - ID of the designer
   * @returns Promise resolving to array of products by the designer
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {DatabaseError} If the query fails
   */
  findByDesigner(designerId: string): Promise<Product[]>;

  /**
   * Search products by query string
   * Searches through product names and descriptions
   *
   * @param query - Search query string
   * @returns Promise resolving to array of matching products
   * @throws {ValidationError} If query string is invalid
   * @throws {DatabaseError} If the search fails
   */
  searchProducts(query: string): Promise<Product[]>;

  /**
   * Update product stock quantity
   *
   * @param productId - ID of the product
   * @param variantId - ID of the specific variant (color/size combination)
   * @param quantity - New quantity to set
   * @throws {NotFoundError} If product or variant doesn't exist
   * @throws {ValidationError} If quantity is invalid
   * @throws {DatabaseError} If the update fails
   */
  updateStock(
    productId: string,
    variantId: string,
    quantity: number,
  ): Promise<void>;

  /**
   * Find products by IDs
   *
   * @param ids - Array of product IDs to find
   * @returns Promise resolving to array of found products
   * @throws {DatabaseError} If the query fails
   */
  findByIds(ids: string[]): Promise<Product[]>;

  /**
   * Find products by color
   *
   * @param color - Color to filter by
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated products result
   * @throws {ValidationError} If color is invalid
   * @throws {DatabaseError} If the query fails
   */
  findByColor(
    color: Color,
    params?: Omit<ProductQueryParams, "colors">,
  ): Promise<PaginatedProducts>;

  /**
   * Find products by size
   *
   * @param size - Size to filter by
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated products result
   * @throws {ValidationError} If size is invalid
   * @throws {DatabaseError} If the query fails
   */
  findBySize(
    size: Size,
    params?: Omit<ProductQueryParams, "sizes">,
  ): Promise<PaginatedProducts>;

  /**
   * Get product statistics
   * Returns various statistics about products
   *
   * @param categoryId - Optional category to get stats for
   * @returns Promise resolving to product statistics
   * @throws {DatabaseError} If the query fails
   */
  getStatistics(categoryId?: string): Promise<{
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    averagePrice: number;
    totalSales: number;
  }>;

  /**
   * Find related products
   * Finds products similar to the given product
   *
   * @param productId - ID of the product to find related items for
   * @param limit - Maximum number of related products to return
   * @returns Promise resolving to array of related products
   * @throws {NotFoundError} If product doesn't exist
   * @throws {DatabaseError} If the query fails
   */
  findRelated(productId: string, limit?: number): Promise<Product[]>;

  /**
   * Find products with low stock
   *
   * @param threshold - Stock threshold to check against (default: 5)
   * @returns Promise resolving to array of products with low stock
   * @throws {ValidationError} If threshold is invalid
   * @throws {DatabaseError} If the query fails
   */
  findLowStock(threshold?: number): Promise<Product[]>;

  /**
   * Check if product is in stock
   *
   * @param productId - ID of the product
   * @param variantId - Optional variant ID
   * @returns Promise resolving to stock status and quantity
   * @throws {NotFoundError} If product or variant doesn't exist
   * @throws {DatabaseError} If the query fails
   */
  checkStock(
    productId: string,
    variantId?: string,
  ): Promise<{
    inStock: boolean;
    quantity: number;
  }>;
}
