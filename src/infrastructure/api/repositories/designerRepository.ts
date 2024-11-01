import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IDesignerRepository } from "@/domain/ports/repositories/IDesignerRepository";
import { Designer, DesignerSettings } from "@/domain/entities/designer.entity";
import { API_ENDPOINTS } from "../endpoints";

/**
 * Repository implementation for handling designer-related operations
 * Provides data access and caching for designer profiles, designs, and settings
 *
 * @implements {IDesignerRepository}
 */
export class DesignerRepository implements IDesignerRepository {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Request designer status for a user
   * Creates a new designer profile with initial data and files
   *
   * @param userId - User ID requesting designer status
   * @param data - Designer profile data including personal and business information
   * @param files - Array of files including profile photo and cover photo
   * @returns Promise resolving to created designer profile
   * @throws {ValidationError} If data is invalid
   * @throws {FileUploadError} If file upload fails
   *
   * @example
   * ```typescript
   * const designer = await designerRepo.requestDesigner(
   *   "user123",
   *   {
   *     fullname: "John Doe",
   *     artistName: "JD Arts",
   *     description: "Digital artist specializing in modern designs"
   *   },
   *   [profilePhotoFile, coverPhotoFile]
   * );
   * ```
   */
  async requestDesigner(
    userId: string,
    data: any,
    files: File[],
  ): Promise<Designer> {
    try {
      const formData = new FormData();

      formData.append("userId", userId);
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      files.forEach((file) => formData.append("files", file));

      const response = await this.apiClient.post<Designer>(
        API_ENDPOINTS.DESIGNERS.REQUEST,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      return response;
    } catch (error) {
      console.error("Error requesting designer status:", error);
      throw error;
    }
  }

  /**
   * Update designer profile information
   * Modifies existing designer profile data
   *
   * @param designerId - Designer ID
   * @param updates - Object containing fields to update
   * @returns Promise resolving to updated designer profile
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {ValidationError} If update data is invalid
   *
   * @example
   * ```typescript
   * const updated = await designerRepo.updateDesignerProfile(
   *   "designer123",
   *   {
   *     description: "Updated bio",
   *     socialMedia: ["https://twitter.com/artist"]
   *   }
   * );
   * ```
   */
  async updateDesignerProfile(
    designerId: string,
    updates: any,
  ): Promise<Designer> {
    try {
      const response = await this.apiClient.post<Designer>(
        API_ENDPOINTS.DESIGNERS.UPDATE,
        { designerId, updates },
      );

      await this.cacheService.deleteByTags([`designer:${designerId}`]);

      return response;
    } catch (error) {
      console.error("Error updating designer profile:", error);
      throw error;
    }
  }

  /**
   * Add or update designer's profile photo
   *
   * @param designerId - Designer ID
   * @param file - Profile photo file
   * @returns Promise resolving to updated designer profile
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {FileUploadError} If upload fails
   * @throws {ValidationError} If file is invalid
   *
   * @example
   * ```typescript
   * const updated = await designerRepo.addProfilePhoto(
   *   "designer123",
   *   profilePhotoFile
   * );
   * ```
   */
  async addProfilePhoto(designerId: string, file: File): Promise<Designer> {
    try {
      const formData = new FormData();
      formData.append("designerId", designerId);
      formData.append("file", file);

      const response = await this.apiClient.post<Designer>(
        API_ENDPOINTS.DESIGNERS.UPLOAD_PHOTO,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      await this.cacheService.deleteByTags([`designer:${designerId}`]);

      return response;
    } catch (error) {
      console.error("Error adding profile photo:", error);
      throw error;
    }
  }

  /**
   * Upload designer's PAN card document
   *
   * @param designerId - Designer ID
   * @param file - PAN card document file
   * @returns Promise resolving to updated designer profile
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {FileUploadError} If upload fails
   * @throws {ValidationError} If file is invalid
   *
   * @example
   * ```typescript
   * const updated = await designerRepo.addPanCard(
   *   "designer123",
   *   panCardFile
   * );
   * ```
   */
  async addPanCard(designerId: string, file: File): Promise<Designer> {
    try {
      const formData = new FormData();
      formData.append("designerId", designerId);
      formData.append("file", file);

      const response = await this.apiClient.post<Designer>(
        API_ENDPOINTS.DESIGNERS.ADD_PAN_CARD,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      await this.cacheService.deleteByTags([`designer:${designerId}`]);

      return response;
    } catch (error) {
      console.error("Error adding PAN card:", error);
      throw error;
    }
  }

  /**
   * Get designer's public profile information
   * Returns only publicly visible data based on designer's privacy settings
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to public profile data
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {PrivacyError} If profile is private
   *
   * @example
   * ```typescript
   * const publicProfile = await designerRepo.getPublicProfile("designer123");
   * ```
   */
  async getPublicProfile(designerId: string): Promise<any> {
    const cacheKey = `designer:${designerId}:public`;

    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<any>(
        API_ENDPOINTS.DESIGNERS.BY_ID(designerId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: [`designer:${designerId}`, "public"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching public profile:", error);
      throw error;
    }
  }

  /**
   * Get designer's personal profile information
   * Returns complete profile data for authenticated designer
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to complete profile data
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {AuthorizationError} If unauthorized to view profile
   *
   * @example
   * ```typescript
   * const personalProfile = await designerRepo.getPersonalProfile("designer123");
   * ```
   */
  async getPersonalProfile(designerId: string): Promise<any> {
    const cacheKey = `designer:${designerId}:personal`;

    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<any>(
        API_ENDPOINTS.DESIGNERS.PERSONAL_PROFILE(designerId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`designer:${designerId}`, "personal"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching personal profile:", error);
      throw error;
    }
  }

  /**
   * Get designs created by a designer
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to array of designer's designs
   * @throws {NotFoundError} If designer doesn't exist
   *
   * @example
   * ```typescript
   * const designs = await designerRepo.getDesigns("designer123");
   * ```
   */
  async getDesigns(designerId: string): Promise<
    Array<{
      title: string;
      description: string;
      designImages: Array<{ url: string }>;
    }>
  > {
    const cacheKey = `designer:${designerId}:designs`;

    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<any>(
        API_ENDPOINTS.DESIGNERS.DESIGN_IMAGES(designerId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`designer:${designerId}`, "designs"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching designs:", error);
      throw error;
    }
  }

  /**
   * Get random designers with their featured designs
   * Returns approved designers with public profiles
   *
   * @returns Promise resolving to array of random designers
   * @throws {ApiError} If fetching fails
   *
   * @example
   * ```typescript
   * const randomDesigners = await designerRepo.getRandomDesigners();
   * ```
   */
  async getRandomDesigners(): Promise<
    Array<{
      profileImage: string | null;
      designImage: string | null;
      totalDesigns: number;
      designerFollowers: number;
      designName: string;
      designerId: string;
      designerName: string;
    }>
  > {
    const cacheKey = "designers:random";

    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<any>(
        API_ENDPOINTS.DESIGNERS.RANDOM,
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 300,
        tags: ["designers", "random"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching random designers:", error);
      throw error;
    }
  }

  /**
   * Create a new design
   * Uploads design file and associates it with the designer
   *
   * @param designerId - Designer ID
   * @param data - Design metadata
   * @param file - Design image file
   * @returns Promise resolving to created design
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {ValidationError} If data or file is invalid
   * @throws {FileUploadError} If file upload fails
   *
   * @example
   * ```typescript
   * const design = await designerRepo.createDesign(
   *   "designer123",
   *   {
   *     title: "Summer Collection",
   *     description: "Vibrant summer designs"
   *   },
   *   designFile
   * );
   * ```
   */
  async createDesign(
    designerId: string,
    data: {
      title?: string;
      description?: string;
      productId?: string;
    },
    file: File,
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("designerId", designerId);
      formData.append("file", file);

      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.productId) formData.append("productId", data.productId);

      const response = await this.apiClient.post<any>(
        API_ENDPOINTS.DESIGNERS.CREATE_DESIGN,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      await this.cacheService.deleteByTags([
        `designer:${designerId}`,
        "designs",
      ]);

      return response;
    } catch (error) {
      console.error("Error creating design:", error);
      throw error;
    }
  }

  /**
   * Get designer's settings
   * Returns privacy and display preferences
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to designer settings
   * @throws {NotFoundError} If designer doesn't exist
   *
   * @example
   * ```typescript
   * const settings = await designerRepo.getSettings("designer123");
   * ```
   */
  async getSettings(designerId: string): Promise<DesignerSettings> {
    const cacheKey = `designer:${designerId}:settings`;

    try {
      const cached = await this.cacheService.get<DesignerSettings>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<DesignerSettings>(
        API_ENDPOINTS.DESIGNERS.SETTINGS(designerId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`designer:${designerId}`, "settings"],
      });

      return response;
    } catch (error) {
      console.error("Error fetching designer settings:", error);
      throw error;
    }
  }

  /**
   * Update designer's settings
   * Modifies privacy and display preferences
   *
   * @param designerId - Designer ID
   * @param settings - Updated settings
   * @returns Promise resolving to updated designer profile
   * @throws {NotFoundError} If designer doesn't exist
   * @throws {ValidationError} If settings are invalid
   *
   * @example
   * ```typescript
   * const updated = await designerRepo.updateSettings(
   *   "designer123",
   *   {
   *     isPrivate: false,
   *     showFollowers: true
   *   }
   * );
   * ```
   */
  async updateSettings(
    designerId: string,
    settings: Partial<DesignerSettings>,
  ): Promise<Designer> {
    try {
      const response = await this.apiClient.post<Designer>(
        API_ENDPOINTS.DESIGNERS.UPDATE_SETTINGS(designerId),
        { settings },
      );

      await this.cacheService.deleteByTags([
        `designer:${designerId}`,
        "settings",
      ]);

      return response;
    } catch (error) {
      console.error("Error updating designer settings:", error);
      throw error;
    }
  }
}
