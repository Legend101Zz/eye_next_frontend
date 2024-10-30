import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IDesignerRepository } from "@/domain/ports/repositories/IDesignerRepository";
import { API_ENDPOINTS } from "../endpoints";
import {
  Designer,
  DesignerProfile,
  DesignerStats,
  DesignerSettings,
  DesignerQueryParams,
  DesignerEarnings,
  PaginatedDesigners,
  DesignerAnalytics,
  SalesReport,
  PortfolioItem,
  LegalDocument,
  DesignerVerificationStatus,
} from "@/domain/entities/designer.entity";

/**
 * Designer Repository Implementation
 * Handles all designer-related data operations with caching
 */
export class DesignerRepository implements IDesignerRepository {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Find designer by ID
   *
   * @param id - Designer ID
   * @returns Promise resolving to designer
   * @throws {NotFoundError} If designer doesn't exist
   */
  async findById(id: string): Promise<Designer> {
    const cacheKey = `designer:${id}`;

    try {
      const cached = await this.cacheService.get<Designer>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Designer>(
        `${API_ENDPOINTS.DESIGNERS.BY_ID(id)}`,
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800, // 30 minutes
        tags: ["designers", `designer:${id}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching designer ${id}:`, error);
      throw error;
    }
  }

  /**
   * Request to become a designer
   *
   * @param userId - User ID requesting designer status
   * @param data - Designer profile data
   * @returns Promise resolving to created designer profile
   * @throws {ValidationError} If data is invalid
   */
  async requestDesignerStatus(
    userId: string,
    data: Omit<Designer, "id" | "isApproved">,
  ): Promise<Designer> {
    try {
      const response = await this.apiClient.post<Designer>(
        API_ENDPOINTS.DESIGNERS.REQUEST,
        {
          userId,
          ...data,
        },
      );

      return response;
    } catch (error) {
      console.error("Error requesting designer status:", error);
      throw error;
    }
  }

  /**
   * Update designer profile
   *
   * @param designerId - Designer ID
   * @param profile - Updated profile data
   * @returns Promise resolving to updated designer
   */
  async updateProfile(
    designerId: string,
    profile: Partial<DesignerProfile>,
  ): Promise<Designer> {
    try {
      const response = await this.apiClient.patch<Designer>(
        API_ENDPOINTS.DESIGNERS.PROFILE(designerId),
        profile,
      );

      await this.cacheService.deleteByTags([`designer:${designerId}`]);

      return response;
    } catch (error) {
      console.error(
        `Error updating profile for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update designer settings
   *
   * @param designerId - Designer ID
   * @param settings - Updated settings
   * @returns Promise resolving to updated designer
   */
  async updateSettings(
    designerId: string,
    settings: Partial<DesignerSettings>,
  ): Promise<Designer> {
    try {
      const response = await this.apiClient.patch<Designer>(
        API_ENDPOINTS.DESIGNERS.SETTINGS(designerId),
        settings,
      );

      await this.cacheService.deleteByTags([`designer:${designerId}`]);

      return response;
    } catch (error) {
      console.error(
        `Error updating settings for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get designer earnings
   *
   * @param designerId - Designer ID
   * @param startDate - Start date for earnings period
   * @param endDate - End date for earnings period
   * @returns Promise resolving to earnings data
   */
  async getEarnings(
    designerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DesignerEarnings> {
    const cacheKey = `designer:${designerId}:earnings:${startDate?.toISOString()}:${endDate?.toISOString()}`;

    try {
      const cached = await this.cacheService.get<DesignerEarnings>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<DesignerEarnings>(
        API_ENDPOINTS.DESIGNERS.EARNINGS(designerId),
        {
          params: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          },
        },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`designer:${designerId}`, "earnings"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching earnings for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get designer analytics
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to analytics data
   */
  async getAnalytics(designerId: string): Promise<DesignerAnalytics> {
    const cacheKey = `designer:${designerId}:analytics`;

    try {
      const cached = await this.cacheService.get<DesignerAnalytics>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<DesignerAnalytics>(
        API_ENDPOINTS.DESIGNERS.ANALYTICS(designerId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`designer:${designerId}`, "analytics"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching analytics for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get sales report
   *
   * @param designerId - Designer ID
   * @param period - Report period ('daily' | 'weekly' | 'monthly' | 'yearly')
   * @returns Promise resolving to sales report
   */
  async getSalesReport(
    designerId: string,
    period: string,
  ): Promise<SalesReport> {
    const cacheKey = `designer:${designerId}:sales:${period}`;

    try {
      const cached = await this.cacheService.get<SalesReport>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<SalesReport>(
        API_ENDPOINTS.DESIGNERS.SALES_REPORT(designerId),
        { params: { period } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`designer:${designerId}`, "sales"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching sales report for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update portfolio
   *
   * @param designerId - Designer ID
   * @param items - Portfolio items
   * @returns Promise resolving to updated designer
   */
  async updatePortfolio(
    designerId: string,
    items: PortfolioItem[],
  ): Promise<Designer> {
    try {
      const response = await this.apiClient.put<Designer>(
        API_ENDPOINTS.DESIGNERS.PORTFOLIO(designerId),
        { items },
      );

      await this.cacheService.deleteByTags([`designer:${designerId}`]);

      return response;
    } catch (error) {
      console.error(
        `Error updating portfolio for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Upload legal documents
   *
   * @param designerId - Designer ID
   * @param documents - Legal documents to upload
   * @returns Promise resolving to updated designer
   */
  async uploadLegalDocuments(
    designerId: string,
    documents: File[],
  ): Promise<LegalDocument[]> {
    try {
      const formData = new FormData();
      documents.forEach((doc) => formData.append("documents", doc));

      const response = await this.apiClient.post<LegalDocument[]>(
        API_ENDPOINTS.DESIGNERS.DOCUMENTS(designerId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      await this.cacheService.deleteByTags([`designer:${designerId}`]);

      return response;
    } catch (error) {
      console.error(
        `Error uploading documents for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get verification status
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to verification status
   */
  async getVerificationStatus(
    designerId: string,
  ): Promise<DesignerVerificationStatus> {
    const cacheKey = `designer:${designerId}:verification`;

    try {
      const cached =
        await this.cacheService.get<DesignerVerificationStatus>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<DesignerVerificationStatus>(
        API_ENDPOINTS.DESIGNERS.VERIFICATION_STATUS(designerId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 300, // 5 minutes
        tags: [`designer:${designerId}`, "verification"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching verification status for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get featured designers
   *
   * @param limit - Maximum number of designers to return
   * @returns Promise resolving to featured designers
   */
  async getFeaturedDesigners(limit: number = 10): Promise<Designer[]> {
    const cacheKey = `designers:featured:${limit}`;

    try {
      const cached = await this.cacheService.get<Designer[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Designer[]>(
        API_ENDPOINTS.DESIGNERS.FEATURED,
        { params: { limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600, // 1 hour
        tags: ["designers", "featured"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching featured designers:", error);
      throw error;
    }
  }

  /**
   * Get top earning designers
   *
   * @param timeframe - Timeframe for earnings ('week' | 'month' | 'year')
   * @param limit - Maximum number of designers to return
   * @returns Promise resolving to top earning designers
   */
  async getTopEarners(
    timeframe: string = "month",
    limit: number = 10,
  ): Promise<Designer[]> {
    const cacheKey = `designers:top-earners:${timeframe}:${limit}`;

    try {
      const cached = await this.cacheService.get<Designer[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<Designer[]>(
        API_ENDPOINTS.DESIGNERS.TOP_EARNERS,
        { params: { timeframe, limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["designers", "top-earners"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching top earning designers:", error);
      throw error;
    }
  }

  /**
   * Get designer followers
   *
   * @param designerId - Designer ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise resolving to paginated followers
   */
  async getFollowers(
    designerId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedDesigners> {
    const cacheKey = `designer:${designerId}:followers:${page}:${limit}`;

    try {
      const cached = await this.cacheService.get<PaginatedDesigners>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<PaginatedDesigners>(
        API_ENDPOINTS.DESIGNERS.FOLLOWERS(designerId),
        { params: { page, limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`designer:${designerId}`, "followers"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching followers for designer ${designerId}:`,
        error,
      );
      throw error;
    }
  }
}
