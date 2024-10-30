import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IProductRepository } from "@/domain/ports/repositories/IProductRepository";
import { API_ENDPOINTS } from "../endpoints";
import {
  Product,
  Category,
  Size,
  Color,
  Gender,
} from "@/domain/entities/product.entity";
import {
  ProductQueryParams,
  PaginatedProducts,
} from "@/domain/ports/repositories/IProductRepository";

/**
 * Product Repository Implementation
 * Handles all product-related data operations with caching
 */
export class ProductRepository implements IProductRepository {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Find all products with filtering, pagination, and sorting
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated products
   * @throws {ApiError} If API request fails
   *
   * @example
   * ```typescript
   * const result = await productRepo.findAll({
   *   category: Category.TSHIRT,
   *   gender: Gender.UNISEX,
   *   sortBy: 'price',
   *   page: 1
   * });
   * ```
   */
  async findAll(params: ProductQueryParams): Promise<PaginatedProducts> {
    const cacheKey = `products:list:${JSON.stringify(params)}`;

    try {
      // Try cache first
      const cached = await this.cacheService.get<PaginatedProducts>(cacheKey);
      if (cached) return cached;

      // Fetch from API
      const response = await this.apiClient.get<PaginatedProducts>(
        API_ENDPOINTS.PRODUCTS.BASE,
        { params },
      );

      // Cache the result
      await this.cacheService.set(cacheKey, response, {
        ttl: 3600, // 1 hour
        tags: [
          "products",
          params.category ? `category:${params.category}` : "",
        ],
      });

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  /**
   * Find a product by its ID
   *
   * @param id - Product ID
   * @returns Promise resolving to product
   * @throws {ApiError} If API request fails
   * @throws {NotFoundError} If product doesn't exist
   */
  async findById(id: string): Promise<Product> {
    const cacheKey = `product:${id}`;

    try {
      const cached = await this.cacheService.get<Product>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Product>(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["products", `product:${id}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find products by category
   *
   * @param category - Product category
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated products
   */
  async findByCategory(
    category: Category,
    params?: Omit<ProductQueryParams, "category">,
  ): Promise<PaginatedProducts> {
    const cacheKey = `products:category:${category}:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<PaginatedProducts>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedProducts>(
        API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category),
        { params },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["products", `category:${category}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get latest products
   *
   * @param limit - Maximum number of products to return
   * @returns Promise resolving to array of products
   */
  async findLatest(limit?: number): Promise<Product[]> {
    const cacheKey = `products:latest:${limit || "default"}`;

    try {
      const cached = await this.cacheService.get<Product[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Product[]>(
        API_ENDPOINTS.PRODUCTS.LATEST,
        { params: { limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800, // 30 minutes
        tags: ["products", "latest"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching latest products:", error);
      throw error;
    }
  }

  /**
   * Get best selling products
   *
   * @param limit - Maximum number of products to return
   * @returns Promise resolving to array of products
   */
  async findBestSellers(limit?: number): Promise<Product[]> {
    const cacheKey = `products:bestsellers:${limit || "default"}`;

    try {
      const cached = await this.cacheService.get<Product[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Product[]>(
        API_ENDPOINTS.PRODUCTS.TRENDING,
        { params: { limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["products", "trending"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      throw error;
    }
  }

  /**
   * Search products by query string
   *
   * @param query - Search query
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated products
   */
  async searchProducts(
    query: string,
    params?: Omit<ProductQueryParams, "search">,
  ): Promise<PaginatedProducts> {
    const cacheKey = `products:search:${query}:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<PaginatedProducts>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedProducts>(
        API_ENDPOINTS.PRODUCTS.SEARCH,
        {
          params: {
            ...params,
            query,
          },
        },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: ["products", "search"],
      });

      return response;
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error);
      throw error;
    }
  }

  /**
   * Get available colors for a product category
   *
   * @param category - Product category
   * @returns Promise resolving to array of available colors
   */
  async getAvailableColors(category: Category): Promise<Color[]> {
    const cacheKey = `products:colors:${category}`;

    try {
      const cached = await this.cacheService.get<Color[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Color[]>(
        API_ENDPOINTS.PRODUCTS.COLORS(category),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 7200, // 2 hours
        tags: ["products", `category:${category}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching colors for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get available sizes for a product category
   *
   * @param category - Product category
   * @returns Promise resolving to array of available sizes
   */
  async getAvailableSizes(category: Category): Promise<Size[]> {
    const cacheKey = `products:sizes:${category}`;

    try {
      const cached = await this.cacheService.get<Size[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Size[]>(
        API_ENDPOINTS.PRODUCTS.SIZES(category),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 7200,
        tags: ["products", `category:${category}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching sizes for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get product statistics
   *
   * @param categoryId - Optional category to get stats for
   * @returns Promise resolving to product statistics
   */
  async getStatistics(categoryId?: string): Promise<{
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    averagePrice: number;
  }> {
    const cacheKey = `products:stats:${categoryId || "all"}`;

    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get(
        API_ENDPOINTS.PRODUCTS.BASE + "/statistics",
        { params: { categoryId } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: ["products", "statistics"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching product statistics:", error);
      throw error;
    }
  }

  /**
   * Find products with low stock
   *
   * @param threshold - Stock threshold to check against
   * @returns Promise resolving to array of products
   */
  async findLowStock(threshold: number = 5): Promise<Product[]> {
    try {
      const response = await this.apiClient.get<Product[]>(
        API_ENDPOINTS.PRODUCTS.BASE + "/low-stock",
        { params: { threshold } },
      );

      return response;
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      throw error;
    }
  }
}
