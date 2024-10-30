import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IFinalProductRepository } from "@/domain/ports/repositories/IFinalProductRepository";
import { API_ENDPOINTS } from "../endpoints";
import {
  FinalProduct,
  CreateFinalProductData,
  DesignApplication,
} from "@/domain/entities/finalProduct.entity";
import {
  FinalProductQueryParams,
  PaginatedFinalProducts,
} from "@/domain/ports/repositories/IFinalProductRepository";

/**
 * Final Product Repository Implementation
 * Handles the creation and management of products with applied designs
 */
export class FinalProductRepository implements IFinalProductRepository {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Create a new final product by applying designs to a base product
   *
   * @param data - Data required to create the final product
   * @returns Promise resolving to created final product
   * @throws {ValidationError} If data is invalid
   * @throws {NotFoundError} If base product or designs don't exist
   *
   * @example
   * ```typescript
   * const finalProduct = await finalProductRepo.createWithDesigns({
   *   baseProductId: 'product123',
   *   designApplications: [{
   *     designId: 'design123',
   *     position: 'front',
   *   }],
   *   color: 'black',
   *   priceAdjustment: 5.00
   * });
   * ```
   */
  async createWithDesigns(data: CreateFinalProductData): Promise<FinalProduct> {
    try {
      const response = await this.apiClient.post<FinalProduct>(
        API_ENDPOINTS.FINAL_PRODUCTS.BASE,
        data,
      );

      // Invalidate relevant caches
      await this.cacheService.deleteByTags([
        "final-products",
        `product:${data.baseProductId}`,
        ...data.designApplications.map((d) => `design:${d.designId}`),
      ]);

      return response;
    } catch (error) {
      console.error("Error creating final product:", error);
      throw error;
    }
  }

  /**
   * Find all final products with filtering and pagination
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated final products
   */
  async findAll(
    params: FinalProductQueryParams,
  ): Promise<PaginatedFinalProducts> {
    const cacheKey = `final-products:list:${JSON.stringify(params)}`;

    try {
      const cached =
        await this.cacheService.get<PaginatedFinalProducts>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedFinalProducts>(
        API_ENDPOINTS.FINAL_PRODUCTS.BASE,
        { params },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800, // 30 minutes
        tags: [
          "final-products",
          params.category ? `category:${params.category}` : "",
        ],
      });

      return response;
    } catch (error) {
      console.error("Error fetching final products:", error);
      throw error;
    }
  }

  /**
   * Find final product by ID
   *
   * @param id - Final product ID
   * @returns Promise resolving to final product
   * @throws {NotFoundError} If product doesn't exist
   */
  async findById(id: string): Promise<FinalProduct> {
    const cacheKey = `final-product:${id}`;

    try {
      const cached = await this.cacheService.get<FinalProduct>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<FinalProduct>(
        API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(id),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["final-products", `final-product:${id}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching final product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find final products by designer
   *
   * @param designerId - Designer ID
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated final products
   */
  async findByDesigner(
    designerId: string,
    params?: Omit<FinalProductQueryParams, "designerId">,
  ): Promise<PaginatedFinalProducts> {
    const cacheKey = `final-products:designer:${designerId}:${JSON.stringify(params)}`;

    try {
      const cached =
        await this.cacheService.get<PaginatedFinalProducts>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedFinalProducts>(
        API_ENDPOINTS.FINAL_PRODUCTS.BY_DESIGNER(designerId),
        { params },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: ["final-products", `designer:${designerId}`],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching final products for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Find products using a specific design
   *
   * @param designId - Design ID
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated final products
   */
  async findByDesign(
    designId: string,
    params?: Omit<FinalProductQueryParams, "designId">,
  ): Promise<PaginatedFinalProducts> {
    const cacheKey = `final-products:design:${designId}:${JSON.stringify(params)}`;

    try {
      const cached =
        await this.cacheService.get<PaginatedFinalProducts>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedFinalProducts>(
        API_ENDPOINTS.FINAL_PRODUCTS.BY_DESIGN(designId),
        { params },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: ["final-products", `design:${designId}`],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching final products with design ${designId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update product variants
   *
   * @param productId - Final product ID
   * @param variants - Updated variant data
   * @returns Promise resolving to updated final product
   */
  async updateVariants(
    productId: string,
    variants: ProductVariant[],
  ): Promise<FinalProduct> {
    try {
      const response = await this.apiClient.put<FinalProduct>(
        `${API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(productId)}/variants`,
        { variants },
      );

      await this.cacheService.deleteByTags([
        "final-products",
        `final-product:${productId}`,
      ]);

      return response;
    } catch (error) {
      console.error(`Error updating variants for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Update design application
   *
   * @param productId - Final product ID
   * @param designId - Design ID
   * @param data - Updated design application data
   * @returns Promise resolving to updated final product
   */
  async updateDesignApplication(
    productId: string,
    designId: string,
    data: Partial<DesignApplication>,
  ): Promise<FinalProduct> {
    try {
      const response = await this.apiClient.patch<FinalProduct>(
        `${API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(productId)}/designs/${designId}`,
        data,
      );

      await this.cacheService.deleteByTags([
        "final-products",
        `final-product:${productId}`,
        `design:${designId}`,
      ]);

      return response;
    } catch (error) {
      console.error(
        `Error updating design application for product ${productId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get product sales data
   *
   * @param productId - Final product ID
   * @param timeframe - Timeframe for sales data
   * @returns Promise resolving to sales data
   */
  async getSalesData(
    productId: string,
    timeframe: "day" | "week" | "month" | "year",
  ): Promise<SalesData> {
    const cacheKey = `final-product:${productId}:sales:${timeframe}`;

    try {
      const cached = await this.cacheService.get<SalesData>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<SalesData>(
        `${API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(productId)}/sales`,
        { params: { timeframe } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`final-product:${productId}`, "sales"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching sales data for product ${productId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update product price
   *
   * @param productId - Final product ID
   * @param price - New price
   * @returns Promise resolving to updated final product
   */
  async updatePrice(productId: string, price: number): Promise<FinalProduct> {
    try {
      const response = await this.apiClient.patch<FinalProduct>(
        API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(productId),
        { price },
      );

      await this.cacheService.deleteByTags([
        "final-products",
        `final-product:${productId}`,
      ]);

      return response;
    } catch (error) {
      console.error(`Error updating price for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Get product statistics
   *
   * @param productId - Final product ID
   * @returns Promise resolving to product statistics
   */
  async getProductStats(productId: string): Promise<FinalProductStats> {
    const cacheKey = `final-product:${productId}:stats`;

    try {
      const cached = await this.cacheService.get<FinalProductStats>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<FinalProductStats>(
        `${API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(productId)}/statistics`,
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`final-product:${productId}`, "statistics"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching statistics for product ${productId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get trending products
   *
   * @param params - Query parameters
   * @returns Promise resolving to paginated final products
   */
  async getTrending(
    params?: FinalProductQueryParams,
  ): Promise<PaginatedFinalProducts> {
    const cacheKey = `final-products:trending:${JSON.stringify(params)}`;

    try {
      const cached =
        await this.cacheService.get<PaginatedFinalProducts>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedFinalProducts>(
        API_ENDPOINTS.FINAL_PRODUCTS.TRENDING,
        { params },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: ["final-products", "trending"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching trending products:", error);
      throw error;
    }
  }

  /**
   * Find similar products
   *
   * @param productId - Final product ID
   * @param limit - Maximum number of products to return
   * @returns Promise resolving to array of similar products
   */
  async findSimilar(
    productId: string,
    limit?: number,
  ): Promise<FinalProduct[]> {
    const cacheKey = `final-product:${productId}:similar:${limit || "default"}`;

    try {
      const cached = await this.cacheService.get<FinalProduct[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<FinalProduct[]>(
        `${API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(productId)}/similar`,
        { params: { limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: [`final-product:${productId}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching similar products for ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Get product recommendations for user
   *
   * @param userId - User ID
   * @param limit - Maximum number of recommendations
   * @returns Promise resolving to recommended products
   */
  async getRecommendations(
    userId: string,
    limit?: number,
  ): Promise<FinalProduct[]> {
    const cacheKey = `recommendations:${userId}:${limit || "default"}`;

    try {
      const cached = await this.cacheService.get<FinalProduct[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<FinalProduct[]>(
        "/recommendations",
        { params: { userId, limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["recommendations", `user:${userId}`],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching recommendations for user ${userId}:`,
        error,
      );
      throw error;
    }
  }
}
