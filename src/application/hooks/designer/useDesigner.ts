import { useCallback, useEffect, useState } from "react";
import { DesignerRepository } from "@/infrastructure/api/repositories/designerRepository";
import { ApiClient } from "@/infrastructure/api/client";
import { CacheService } from "@/infrastructure/cache/cacheService";
import { Designer, DesignerSettings } from "@/domain/entities/designer.entity";
import { Redis } from "ioredis";

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Initialize services
const cacheService = new CacheService({
  provider: "redis",
  redisUrl: process.env.REDIS_URL,
  maxSize: 1000,
});

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  cacheService,
});

const designerRepository = new DesignerRepository(apiClient, cacheService);

interface UseDesignerParams {
  designerId?: string;
  shouldFetchOnMount?: boolean;
}

interface DesignerProfileData {
  fullname: string;
  artistName: string;
  description?: string;
  [key: string]: any;
}

interface CreateDesignData {
  title?: string;
  description?: string;
  productId?: string;
}

/**
 * Custom hook for managing designer data and operations
 * Provides comprehensive designer profile management with caching
 *
 * @param params - Configuration parameters for the hook
 * @returns Object containing designer state and methods
 *
 * @example
 * ```tsx
 * const {
 *   designer,
 *   designs,
 *   settings,
 *   loading,
 *   error,
 *   updateProfile,
 *   createDesign
 * } = useDesigner({
 *   designerId: 'designer123',
 *   shouldFetchOnMount: true
 * });
 * ```
 */
export const useDesigner = ({
  designerId,
  shouldFetchOnMount = true,
}: UseDesignerParams = {}) => {
  // State
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [publicProfile, setPublicProfile] = useState<any>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [settings, setSettings] = useState<DesignerSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request designer status for a user
   */
  const requestDesigner = async (
    userId: string,
    data: DesignerProfileData,
    files: File[],
  ) => {
    try {
      setLoading(true);
      const response = await designerRepository.requestDesigner(
        userId,
        data,
        files,
      );
      setDesigner(response);
      return response;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to request designer status",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update designer profile
   */
  const updateProfile = async (updates: Partial<DesignerProfileData>) => {
    if (!designerId) return;

    try {
      setLoading(true);
      const updated = await designerRepository.updateDesignerProfile(
        designerId,
        updates,
      );
      setDesigner(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload profile photo
   */
  const uploadProfilePhoto = async (file: File) => {
    if (!designerId) return;

    try {
      setLoading(true);
      const updated = await designerRepository.addProfilePhoto(
        designerId,
        file,
      );
      setDesigner(updated);
      return updated;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload profile photo",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload PAN card
   */
  const uploadPanCard = async (file: File) => {
    if (!designerId) return;

    try {
      setLoading(true);
      const updated = await designerRepository.addPanCard(designerId, file);
      setDesigner(updated);
      return updated;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload PAN card",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch designer's public profile
   */
  const fetchPublicProfile = useCallback(async () => {
    if (!designerId) return;

    try {
      setLoading(true);
      const profile = await designerRepository.getPublicProfile(designerId);
      setPublicProfile(profile);
      return profile;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch public profile",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [designerId]);

  /**
   * Fetch designer's personal profile
   */
  const fetchPersonalProfile = useCallback(async () => {
    if (!designerId) return;

    try {
      setLoading(true);
      const profile = await designerRepository.getPersonalProfile(designerId);
      setDesigner(profile);
      return profile;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch personal profile",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [designerId]);

  /**
   * Fetch designer's designs
   */
  const fetchDesigns = useCallback(async () => {
    if (!designerId) return;

    try {
      setLoading(true);
      const designs = await designerRepository.getDesigns(designerId);
      setDesigns(designs);
      return designs;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch designs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [designerId]);

  /**
   * Create a new design
   */
  const createDesign = async (data: CreateDesignData, file: File) => {
    if (!designerId) return;

    try {
      setLoading(true);
      const design = await designerRepository.createDesign(
        designerId,
        data,
        file,
      );
      setDesigns((prev) => [...prev, design]);
      return design;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create design");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch designer settings
   */
  const fetchSettings = useCallback(async () => {
    if (!designerId) return;

    try {
      setLoading(true);
      const settings = await designerRepository.getSettings(designerId);
      setSettings(settings);
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [designerId]);

  /**
   * Update designer settings
   */
  const updateSettings = async (updates: Partial<DesignerSettings>) => {
    if (!designerId) return;

    try {
      setLoading(true);
      const updated = await designerRepository.updateSettings(
        designerId,
        updates,
      );
      setDesigner(updated);
      setSettings((prev) => ({ ...prev, ...updates }));
      return updated;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh all designer data
   */
  const refreshData = useCallback(async () => {
    if (!designerId) return;

    try {
      setLoading(true);
      await Promise.all([
        fetchPersonalProfile(),
        fetchPublicProfile(),
        fetchDesigns(),
        fetchSettings(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [
    designerId,
    fetchPersonalProfile,
    fetchPublicProfile,
    fetchDesigns,
    fetchSettings,
  ]);

  // Initialize data on mount
  useEffect(() => {
    if (shouldFetchOnMount && designerId) {
      refreshData();
    }
  }, [shouldFetchOnMount, designerId, refreshData]);

  return {
    // State
    designer,
    publicProfile,
    designs,
    settings,
    loading,
    error,

    // Profile Methods
    requestDesigner,
    updateProfile,
    uploadProfilePhoto,
    uploadPanCard,

    // Design Methods
    createDesign,

    // Settings Methods
    updateSettings,

    // Fetch Methods
    fetchPublicProfile,
    fetchPersonalProfile,
    fetchDesigns,
    fetchSettings,
    refreshData,
  };
};

/**
 * Hook for managing random designers
 *
 * @returns Object containing random designers state and methods
 *
 * @example
 * ```tsx
 * const {
 *   designers,
 *   loading,
 *   error,
 *   refreshDesigners
 * } = useRandomDesigners();
 * ```
 */
export const useRandomDesigners = () => {
  const [designers, setDesigners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomDesigners = useCallback(async () => {
    try {
      setLoading(true);
      const response = await designerRepository.getRandomDesigners();
      setDesigners(response);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch random designers",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomDesigners();
  }, [fetchRandomDesigners]);

  return {
    designers,
    loading,
    error,
    refreshDesigners: fetchRandomDesigners,
  };
};
