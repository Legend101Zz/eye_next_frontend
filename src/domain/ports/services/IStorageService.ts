import {
  FileType,
  FileUploadOptions,
  UploadedFile,
  FileMetadata,
  StorageStats,
  ImageTransformOptions,
} from "@/domain/entities/storage.entity";

/**
 * Storage Service Interface
 * Handles file storage operations using cloud providers
 */
export interface IStorageService {
  /**
   * Upload a design image
   *
   * @param file - Image file to upload
   * @param options - Upload options
   * @returns Promise resolving to uploaded file details
   * @throws {ValidationError} If file is invalid
   */
  uploadDesignImage(
    file: File,
    options?: FileUploadOptions,
  ): Promise<UploadedFile>;

  /**
   * Upload a profile image
   *
   * @param file - Image file to upload
   * @param userId - User ID
   * @param options - Upload options
   * @returns Promise resolving to uploaded file details
   */
  uploadProfileImage(
    file: File,
    userId: string,
    options?: FileUploadOptions,
  ): Promise<UploadedFile>;

  /**
   * Upload a cover image
   *
   * @param file - Image file to upload
   * @param userId - User ID
   * @param options - Upload options
   * @returns Promise resolving to uploaded file details
   */
  uploadCoverImage(
    file: File,
    userId: string,
    options?: FileUploadOptions,
  ): Promise<UploadedFile>;

  /**
   * Upload a document
   *
   * @param file - Document file
   * @param metadata - File metadata
   * @returns Promise resolving to uploaded file details
   */
  uploadDocument(
    file: File,
    metadata: Partial<FileMetadata>,
  ): Promise<UploadedFile>;

  /**
   * Delete a file
   *
   * @param fileId - ID of file to delete
   * @returns Promise resolving to boolean indicating success
   */
  deleteFile(fileId: string): Promise<boolean>;

  /**
   * Get file metadata
   *
   * @param fileId - File ID
   * @returns Promise resolving to file metadata
   */
  getFileMetadata(fileId: string): Promise<FileMetadata>;

  /**
   * Transform an image
   *
   * @param fileId - Image file ID
   * @param options - Transformation options
   * @returns Promise resolving to transformed image URL
   */
  transformImage(
    fileId: string,
    options: ImageTransformOptions,
  ): Promise<string>;

  /**
   * Get an optimized image URL
   *
   * @param fileId - Image file ID
   * @param width - Desired width
   * @param height - Desired height
   * @returns Promise resolving to optimized image URL
   */
  getOptimizedImageUrl(
    fileId: string,
    width?: number,
    height?: number,
  ): Promise<string>;

  /**
   * Get storage statistics
   *
   * @returns Promise resolving to storage statistics
   */
  getStorageStats(): Promise<StorageStats>;

  /**
   * Get files by tags
   *
   * @param tags - Tags to filter by
   * @returns Promise resolving to array of file metadata
   */
  getFilesByTags(tags: string[]): Promise<FileMetadata[]>;

  /**
   * Update file metadata
   *
   * @param fileId - File ID
   * @param metadata - Metadata to update
   * @returns Promise resolving to updated file metadata
   */
  updateFileMetadata(
    fileId: string,
    metadata: Partial<FileMetadata>,
  ): Promise<FileMetadata>;

  /**
   * Generate a signed URL for temporary access
   *
   * @param fileId - File ID
   * @param expiresIn - Expiration time in seconds
   * @returns Promise resolving to signed URL
   */
  getSignedUrl(fileId: string, expiresIn: number): Promise<string>;
}
