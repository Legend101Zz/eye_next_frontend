import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IDesignRepository } from "@/domain/ports/repositories/IDesignRepository";
import { API_ENDPOINTS } from "../endpoints";
import {
  Design,
  DesignImage,
  DesignUsage,
} from "@/domain/entities/design.entity";
import {
  DesignQueryParams,
  PaginatedDesigns,
} from "@/domain/ports/repositories/IDesignRepository";

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
   * Find all designs with filtering, pagination, and sorting
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated designs
   * @throws {ApiError} If API request fails
   *
   * @example
   * ```typescript
   * const result = await designRepo.findAll({
   *   isVerified: true,
   *   sortBy: 'popularity',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async findAll(params: DesignQueryParams): Promise<PaginatedDesigns> {
    const cacheKey = `designs:list:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<PaginatedDesigns>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedDesigns>(
        API_ENDPOINTS.DESIGNS.BASE,
        { params },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800, // 30 minutes
        tags: ["designs", params.isVerified ? "verified" : "unverified"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching designs:", error);
      throw error;
    }
  }

  /**
   * Find designs by designer
   *
   * @param designerId - ID of the designer
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated designs
   * @throws {NotFoundError} If designer doesn't exist
   */
  async findByDesigner(
    designerId: string,
    params?: Omit<DesignQueryParams, "designerId">,
  ): Promise<PaginatedDesigns> {
    const cacheKey = `designs:designer:${designerId}:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<PaginatedDesigns>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedDesigns>(
        API_ENDPOINTS.DESIGNS.BY_DESIGNER(designerId),
        { params },
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
   * Find design by ID
   *
   * @param id - Design ID
   * @returns Promise resolving to design
   * @throws {NotFoundError} If design doesn't exist
   */
  async findById(id: string): Promise<Design> {
    const cacheKey = `design:${id}`;

    try {
      const cached = await this.cacheService.get<Design>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Design>(
        API_ENDPOINTS.DESIGNS.BY_ID(id),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600, // 1 hour
        tags: ["designs", `design:${id}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching design ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new design
   *
   * @param data - Design data
   * @returns Promise resolving to created design
   * @throws {ValidationError} If data is invalid
   */
  async create(data: Omit<Design, "id">): Promise<Design> {
    try {
      const response = await this.apiClient.post<Design>(
        API_ENDPOINTS.DESIGNS.BASE,
        data,
      );

      // Invalidate relevant caches
      await this.cacheService.deleteByTags([
        "designs",
        `designer:${data.designerId}`,
      ]);

      return response;
    } catch (error) {
      console.error("Error creating design:", error);
      throw error;
    }
  }

  /**
   * Upload design images
   *
   * @param designId - Design ID
   * @param files - Image files to upload
   * @returns Promise resolving to uploaded images
   * @throws {ValidationError} If files are invalid
   */
  async uploadImages(designId: string, files: File[]): Promise<DesignImage[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await this.apiClient.post<DesignImage[]>(
        API_ENDPOINTS.DESIGNS.UPLOAD,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: { designId },
        },
      );

      // Invalidate design cache
      await this.cacheService.deleteByTags([`design:${designId}`]);

      return response;
    } catch (error) {
      console.error("Error uploading design images:", error);
      throw error;
    }
  }

  /**
   * Verify a design
   *
   * @param designId - Design ID
   * @returns Promise resolving to updated design
   * @throws {NotFoundError} If design doesn't exist
   */
  async verifyDesign(designId: string): Promise<Design> {
    try {
      const response = await this.apiClient.post<Design>(
        API_ENDPOINTS.DESIGNS.VERIFY(designId),
      );

      // Invalidate relevant caches
      await this.cacheService.deleteByTags([
        "designs",
        `design:${designId}`,
        "unverified",
      ]);

      return response;
    } catch (error) {
      console.error(`Error verifying design ${designId}:`, error);
      throw error;
    }
  }

  /**
   * Reject a design with reason
   *
   * @param designId - Design ID
   * @param reason - Rejection reason
   * @returns Promise resolving to updated design
   */
  async rejectDesign(designId: string, reason: string): Promise<Design> {
    try {
      const response = await this.apiClient.post<Design>(
        API_ENDPOINTS.DESIGNS.REJECT(designId),
        { reason },
      );

      // Invalidate relevant caches
      await this.cacheService.deleteByTags([
        "designs",
        `design:${designId}`,
        "unverified",
      ]);

      return response;
    } catch (error) {
      console.error(`Error rejecting design ${designId}:`, error);
      throw error;
    }
  }

  /**
   * Get design usage statistics
   *
   * @param designId - Design ID
   * @returns Promise resolving to design usage data
   */
  async getDesignUsage(designId: string): Promise<DesignUsage[]> {
    const cacheKey = `design:${designId}:usage`;

    try {
      const cached = await this.cacheService.get<DesignUsage[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<DesignUsage[]>(
        `${API_ENDPOINTS.DESIGNS.BY_ID(designId)}/usage`,
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`design:${designId}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching usage for design ${designId}:`, error);
      throw error;
    }
  }

  /**
   * Find similar designs
   *
   * @param designId - Design ID
   * @param limit - Maximum number of designs to return
   * @returns Promise resolving to array of similar designs
   */
  async findSimilarDesigns(
    designId: string,
    limit?: number,
  ): Promise<Design[]> {
    const cacheKey = `design:${designId}:similar:${limit || "default"}`;

    try {
      const cached = await this.cacheService.get<Design[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Design[]>(
        `${API_ENDPOINTS.DESIGNS.BY_ID(designId)}/similar`,
        { params: { limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: [`design:${designId}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching similar designs for ${designId}:`, error);
      throw error;
    }
  }

  /**
   * Get trending designs
   *
   * @param params - Query parameters
   * @returns Promise resolving to paginated designs
   */
  async getTrendingDesigns(
    params?: Omit<DesignQueryParams, "sortBy">,
  ): Promise<PaginatedDesigns> {
    const cacheKey = `designs:trending:${JSON.stringify(params)}`;

    try {
      const cached = await this.cacheService.get<PaginatedDesigns>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedDesigns>(
        API_ENDPOINTS.DESIGNS.TRENDING,
        { params },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: ["designs", "trending"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching trending designs:", error);
      throw error;
    }
  }

  /**
   * Update design metadata
   *
   * @param designId - Design ID
   * @param data - Updated design data
   * @returns Promise resolving to updated design
   */
  async updateMetadata(
    designId: string,
    data: Partial<Design>,
  ): Promise<Design> {
    try {
      const response = await this.apiClient.post<Design>(
        API_ENDPOINTS.DESIGNS.BY_ID(designId),
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
