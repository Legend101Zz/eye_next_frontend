import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IProductRepository } from "@/domain/ports/repositories/IProductRepository";
import {
  Product,
  Gender,
  Color,
  Category,
} from "@/domain/entities/product.entity";
import { API_ENDPOINTS } from "../endpoints";

/**
 * Product Repository Implementation
 * Handles all product-related data operations with caching
 * Note it only should handle the GET routes as the functionality to create/edit product
 * should remain with the admin
 */
export class ProductRepository implements Partial<IProductRepository> {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Find product by ID
   */
  async findById(id: string): Promise<Product | null> {
    const cacheKey = `product:${id}`;

    try {
      const cached = await this.cacheService.get<Product>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Product>(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
      );

      if (response) {
        await this.cacheService.set(cacheKey, response, {
          ttl: 3600,
          tags: ["products", `product:${id}`],
        });
      }

      return response;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  /**
   * Get product images filtered by color/category
   */
  async getProductImages(params: {
    color?: Color;
    category?: Category;
  }): Promise<
    {
      productId: string;
      imageUrls: string[];
    }[]
  > {
    const cacheKey = `product:images:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<
        {
          productId: string;
          imageUrls: string[];
        }[]
      >(API_ENDPOINTS.PRODUCTS.IMAGE, {
        params,
      });

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["products", "images"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching product images:", error);
      throw error;
    }
  }

  /**
   * Get colors available for a category
   */
  async getColorsByCategory(category: Category): Promise<Color[]> {
    const cacheKey = `category:${category}:colors`;

    try {
      const cached = await this.cacheService.get<Color[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<{ colors: Color[] }>(
        API_ENDPOINTS.PRODUCTS.COLOR,
        { params: { category } },
      );

      await this.cacheService.set(cacheKey, response.colors, {
        ttl: 3600,
        tags: ["products", `category:${category}`],
      });

      return response.colors;
    } catch (error) {
      console.error("Error fetching category colors:", error);
      throw error;
    }
  }

  /**
   * Find products by name and gender
   */
  async getProductByName(params: {
    name: string;
    gender?: Gender;
  }): Promise<Product[]> {
    const cacheKey = `products:name:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<Product[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<{ products: Product[] }>(
        API_ENDPOINTS.PRODUCTS.BY_NAME,
        { params },
      );

      await this.cacheService.set(cacheKey, response.products, {
        ttl: 1800,
        tags: ["products"],
      });

      return response.products;
    } catch (error) {
      console.error("Error fetching products by name:", error);
      throw error;
    }
  }

  // Implement other required interface methods...
  // to be implemented later

  // async findAll(params: ProductQueryParams): Promise<PaginatedProducts> {
  //   // Implementation...
  //   throw new Error("Method not implemented.");
  // }

  // async findByCategory(category: Category): Promise<Product[]> {
  //   // Implementation...
  //   throw new Error("Method not implemented.");
  // }

  // async findLatest(limit?: number): Promise<Product[]> {
  //   // Implementation...
  //   throw new Error("Method not implemented.");
  // }

  // async findBestSellers(limit?: number): Promise<Product[]> {
  //   // Implementation...
  //   throw new Error("Method not implemented.");
  // }

  // ... other required methods
}
