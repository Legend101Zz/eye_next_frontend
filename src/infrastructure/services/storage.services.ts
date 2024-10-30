import { IStorageService } from "@/domain/ports/services/IStorageService";
import { ApiClient } from "../api/client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { API_ENDPOINTS } from "../api/endpoints";
import sharp from "sharp";
import {
  UploadedFile,
  FileUploadOptions,
  FileMetadata,
  ImageDimensions,
  StorageStats,
  FileType,
} from "@/domain/entities/storage.entity";

/**
 * Supported file types and their configurations
 */
const FILE_CONFIGS = {
  DESIGN: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/png", "image/jpeg", "image/svg+xml"],
    dimensions: {
      maxWidth: 4000,
      maxHeight: 4000,
      minWidth: 500,
      minHeight: 500,
    },
  },
  PROFILE: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ["image/png", "image/jpeg"],
    dimensions: {
      maxWidth: 1000,
      maxHeight: 1000,
      minWidth: 200,
      minHeight: 200,
    },
  },
  DOCUMENT: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["application/pdf"],
  },
} as const;

/**
 * Storage Service Implementation
 * Handles file uploads, processing, and management
 */
export class StorageService implements IStorageService {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Upload a design image
   *
   * @param file - Image file to upload
   * @param options - Upload options
   * @returns Promise resolving to uploaded file details
   * @throws {ValidationError} If file is invalid
   *
   * @example
   * ```typescript
   * const file = await storageService.uploadDesignImage(
   *   imageFile,
   *   {
   *     optimize: true,
   *     preserveAspectRatio: true
   *   }
   * );
   * ```
   */
  async uploadDesignImage(
    file: File,
    options: FileUploadOptions = {},
  ): Promise<UploadedFile> {
    try {
      // Validate file
      await this.validateFile(file, "DESIGN");

      // Process image if needed
      const processedFile = options.optimize
        ? await this.optimizeImage(file, FILE_CONFIGS.DESIGN.dimensions)
        : file;

      // Prepare form data
      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("options", JSON.stringify(options));

      // Upload file
      const response = await this.apiClient.post<UploadedFile>(
        API_ENDPOINTS.STORAGE.UPLOAD_DESIGN,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // Cache file metadata
      await this.cacheService.set(`file:${response.id}`, response, {
        ttl: 3600,
        tags: ["files", "designs"],
      });

      return response;
    } catch (error) {
      console.error("Design upload error:", error);
      throw error;
    }
  }

  /**
   * Upload a profile image
   *
   * @param file - Image file to upload
   * @param userId - User ID
   * @returns Promise resolving to uploaded file details
   */
  async uploadProfileImage(file: File, userId: string): Promise<UploadedFile> {
    try {
      await this.validateFile(file, "PROFILE");

      const processedFile = await this.optimizeImage(
        file,
        FILE_CONFIGS.PROFILE.dimensions,
      );

      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("userId", userId);

      const response = await this.apiClient.post<UploadedFile>(
        API_ENDPOINTS.STORAGE.UPLOAD_PROFILE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // Invalidate user profile cache
      await this.cacheService.deleteByTags([`user:${userId}`]);

      return response;
    } catch (error) {
      console.error("Profile upload error:", error);
      throw error;
    }
  }

  /**
   * Upload a legal document
   *
   * @param file - Document file to upload
   * @param metadata - File metadata
   * @returns Promise resolving to uploaded file details
   */
  async uploadDocument(
    file: File,
    metadata: FileMetadata,
  ): Promise<UploadedFile> {
    try {
      await this.validateFile(file, "DOCUMENT");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("metadata", JSON.stringify(metadata));

      return await this.apiClient.post<UploadedFile>(
        API_ENDPOINTS.STORAGE.UPLOAD_DOCUMENT,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
    } catch (error) {
      console.error("Document upload error:", error);
      throw error;
    }
  }

  /**
   * Delete a file
   *
   * @param fileId - ID of file to delete
   * @returns Promise resolving to boolean indicating success
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.apiClient.delete(API_ENDPOINTS.STORAGE.DELETE_FILE(fileId));

      // Remove from cache
      await this.cacheService.delete(`file:${fileId}`);

      return true;
    } catch (error) {
      console.error("File deletion error:", error);
      return false;
    }
  }

  /**
   * Get file metadata
   *
   * @param fileId - File ID
   * @returns Promise resolving to file metadata
   */
  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    const cacheKey = `file:${fileId}:metadata`;

    try {
      const cached = await this.cacheService.get<FileMetadata>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<FileMetadata>(
        API_ENDPOINTS.STORAGE.FILE_METADATA(fileId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: ["files", `file:${fileId}`],
      });

      return response;
    } catch (error) {
      console.error("Get metadata error:", error);
      throw error;
    }
  }

  /**
   * Get storage statistics
   *
   * @returns Promise resolving to storage statistics
   */
  async getStorageStats(): Promise<StorageStats> {
    const cacheKey = "storage:stats";

    try {
      const cached = await this.cacheService.get<StorageStats>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<StorageStats>(
        API_ENDPOINTS.STORAGE.STATS,
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 300, // 5 minutes
        tags: ["storage", "stats"],
      });

      return response;
    } catch (error) {
      console.error("Get stats error:", error);
      throw error;
    }
  }

  /**
   * Validate a file
   *
   * @param file - File to validate
   * @param type - Type of file
   * @throws {ValidationError} If file is invalid
   */
  private async validateFile(file: File, type: FileType): Promise<void> {
    const config = FILE_CONFIGS[type];

    // Check file size
    if (file.size > config.maxSize) {
      throw new Error(
        `File size exceeds maximum of ${config.maxSize / 1024 / 1024}MB`,
      );
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Allowed types: ${config.allowedTypes.join(", ")}`,
      );
    }

    // Check image dimensions if applicable
    if ("dimensions" in config && file.type.startsWith("image/")) {
      const dimensions = await this.getImageDimensions(file);
      const { maxWidth, maxHeight, minWidth, minHeight } = config.dimensions;

      if (dimensions.width < minWidth || dimensions.height < minHeight) {
        throw new Error(
          `Image dimensions too small. Minimum: ${minWidth}x${minHeight}px`,
        );
      }

      if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
        throw new Error(
          `Image dimensions too large. Maximum: ${maxWidth}x${maxHeight}px`,
        );
      }
    }
  }

  /**
   * Get image dimensions
   *
   * @param file - Image file
   * @returns Promise resolving to image dimensions
   */
  private async getImageDimensions(file: File): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Optimize an image
   *
   * @param file - Image file to optimize
   * @param dimensions - Target dimensions
   * @returns Promise resolving to optimized file
   */
  private async optimizeImage(
    file: File,
    dimensions: ImageDimensions,
  ): Promise<File> {
    const buffer = await file.arrayBuffer();
    const image = sharp(buffer);

    const optimized = await image
      .resize(dimensions.maxWidth, dimensions.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return new File([optimized], file.name, { type: "image/jpeg" });
  }
}
