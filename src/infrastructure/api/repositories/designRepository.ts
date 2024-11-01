import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IDesignRepository } from "@/domain/ports/repositories/IDesignRepository";
import { Design } from "@/domain/entities/design.entity";
import { API_ENDPOINTS } from "../endpoints";

/**
 * Design Repository Implementation
 * Handles all design-related data operations with caching
 */
export class DesignRepository implements IDesignRepository {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Show all designs
   */
  async showDesigns(): Promise<Design[]> {
    const cacheKey = "designs:all";

    try {
      const cached = await this.cacheService.get<Design[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Design[]>(
        API_ENDPOINTS.DESIGNS.SHOW_ALL,
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800, // 30 minutes
        tags: ["designs"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching designs:", error);
      throw error;
    }
  }

  /**
   * Get random designs
   */
  async getRandomDesigns(): Promise<Design[]> {
    try {
      const response = await this.apiClient.get<Design[]>(
        API_ENDPOINTS.DESIGNS.RANDOM,
      );

      // Don't cache random designs as they should be different each time
      return response;
    } catch (error) {
      console.error("Error fetching random designs:", error);
      throw error;
    }
  }

  /**
   * Get designs by designer
   */
  async getDesignerDesigns(designerId: string): Promise<Design[]> {
    const cacheKey = `designs:designer:${designerId}`;

    try {
      const cached = await this.cacheService.get<Design[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Design[]>(
        API_ENDPOINTS.DESIGNS.BY_DESIGNER(designerId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: ["designs", `designer:${designerId}`],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching designs for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update design
   */
  async updateDesign(
    designId: string,
    data: {
      title?: string;
      description?: string;
      productIds?: string[];
    },
  ): Promise<Design> {
    try {
      const response = await this.apiClient.post<Design>(
        API_ENDPOINTS.DESIGNS.UPDATE(designId),
        data,
      );

      // Invalidate relevant caches
      await this.cacheService.deleteByTags(["designs", `design:${designId}`]);

      return response;
    } catch (error) {
      console.error(`Error updating design ${designId}:`, error);
      throw error;
    }
  }
}
