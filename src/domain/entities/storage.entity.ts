/**
 * Supported storage providers
 */
export enum StorageProvider {
  CLOUDINARY = "cloudinary",
  AZURE = "azure",
}

/**
 * Supported file types
 */
export enum FileType {
  DESIGN = "DESIGN",
  PROFILE = "PROFILE",
  COVER = "COVER",
  DOCUMENT = "DOCUMENT",
}

/**
 * Image transformation options
 */
export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "jpg" | "png" | "webp";
  crop?: "fill" | "fit" | "scale";
  aspectRatio?: string;
  background?: string;
}

/**
 * File upload options
 */
export interface FileUploadOptions {
  folder?: string;
  transformations?: ImageTransformOptions;
  tags?: string[];
  overwrite?: boolean;
  optimize?: boolean;
  preserveAspectRatio?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Image dimensions
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * File metadata
 */
export interface FileMetadata {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  encoding: string;
  size: number;
  width?: number;
  height?: number;
  format?: string;
  resourceType: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  secureUrl: string;
  publicId: string;
  provider: StorageProvider;
  folder?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Uploaded file response
 */
export interface UploadedFile {
  id: string;
  url: string;
  secureUrl: string;
  publicId: string;
  metadata: FileMetadata;
}

/**
 * Storage statistics
 */
export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  usedStorage: number;
  availableStorage: number;
  filesByType: Record<FileType, number>;
  bandwidthUsage: {
    current: number;
    limit: number;
    period: string;
  };
  storageUsage: {
    current: number;
    limit: number;
    percentage: number;
  };
}
