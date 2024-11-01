import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IFinalProductRepository } from "@/domain/ports/repositories/IFinalProductRepository";
import { API_ENDPOINTS } from "../endpoints";
import {
  GroupedProduct,
  IFinalProductResponse,
} from "@/domain/entities/finalProduct.entity";
import { FinalProductQueryParams } from "@/domain/ports/repositories/IFinalProductRepository";

/**
 * Final Product Repository Implementation
 * Handles the creation and management of products with applied designs
 */
export class FinalProductRepository
  implements Partial<IFinalProductRepository>
{
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  async getProducts(
    params: FinalProductQueryParams,
  ): Promise<GroupedProduct[]> {
    const cacheKey = `products:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<GroupedProduct[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<{ products: GroupedProduct[] }>(
        API_ENDPOINTS.FINAL_PRODUCTS.ALL,
        { params },
      );

      await this.cacheService.set(cacheKey, response.products, {
        ttl: 1800,
        tags: [
          "products",
          params.category ? `category:${params.category}` : "",
        ],
      });

      return response.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getSingleProduct(productId: string): Promise<IFinalProductResponse> {
    const cacheKey = `product:${productId}`;

    try {
      const cached =
        await this.cacheService.get<IFinalProductResponse>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<IFinalProductResponse>(
        API_ENDPOINTS.FINAL_PRODUCTS.BY_ID(productId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["products", `product:${productId}`],
      });

      return response;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  async createFinalProduct(
    data: any,
    files: File[],
  ): Promise<IFinalProductResponse> {
    try {
      const formData = new FormData();

      // Add basic product data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "string" ? value : JSON.stringify(value),
        );
      });

      // Add images
      files.forEach((file) => formData.append("images", file));

      const response = await this.apiClient.post<{
        finalProduct: IFinalProductResponse;
      }>(API_ENDPOINTS.FINAL_PRODUCTS.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Invalidate relevant caches
      await this.cacheService.deleteByTags([
        "products",
        `category:${response.finalProduct.category}`,
      ]);

      return response.finalProduct;
    } catch (error) {
      console.error("Error creating final product:", error);
      throw error;
    }
  }

  // Implement other methods similarly...

  async getLatestProducts(): Promise<GroupedProduct[]> {
    const cacheKey = "products:latest";

    try {
      const cached = await this.cacheService.get<GroupedProduct[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<{ products: GroupedProduct[] }>(
        API_ENDPOINTS.FINAL_PRODUCTS.LATEST,
      );

      await this.cacheService.set(cacheKey, response.products, {
        ttl: 300, // Short TTL for latest products
        tags: ["products", "latest"],
      });

      return response.products;
    } catch (error) {
      console.error("Error fetching latest products:", error);
      throw error;
    }
  }
}
