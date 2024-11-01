import { useCallback, useEffect, useState } from "react";
import { DesignRepository } from "@/infrastructure/api/repositories/designRepository";
import { ApiClient } from "@/infrastructure/api/client";
import { CacheService } from "@/infrastructure/cache/cacheService";
import { Design } from "@/domain/entities/design.entity";
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

const designRepository = new DesignRepository(apiClient, cacheService);

interface UseDesignParams {
  designerId?: string;
  initialDesigns?: Design[];
  shouldFetchOnMount?: boolean;
}

interface UseDesignReturn {
  // State
  designs: Design[];
  randomDesigns: Design[];
  designerDesigns: Design[];
  loading: boolean;
  error: string | null;

  // Methods
  fetchDesigns: () => Promise<void>;
  fetchRandomDesigns: () => Promise<void>;
  fetchDesignerDesigns: (designerId: string) => Promise<void>;
  updateDesign: (designId: string, data: UpdateDesignData) => Promise<Design>;
  refreshDesigns: () => Promise<void>;
}

interface UpdateDesignData {
  title?: string;
  description?: string;
  productIds?: string[];
}

/**
 * Custom hook for managing designs with caching
 * Provides design fetching, updating, and caching functionality
 *
 * @param params - Configuration params for the hook
 * @returns Object containing design state and methods
 *
 * @example
 * ```tsx
 * const {
 *   designs,
 *   randomDesigns,
 *   designerDesigns,
 *   loading,
 *   error,
 *   fetchDesigns,
 *   updateDesign
 * } = useDesign({
 *   designerId: 'designer123',
 *   shouldFetchOnMount: true
 * });
 *
 * if (loading) return <Loading />;
 * if (error) return <Error message={error} />;
 *
 * return (
 *   <DesignGrid designs={designs} />
 * );
 * ```
 */
export const useDesign = ({
  designerId,
  initialDesigns = [],
  shouldFetchOnMount = true,
}: UseDesignParams = {}): UseDesignReturn => {
  // State
  const [designs, setDesigns] = useState<Design[]>(initialDesigns);
  const [randomDesigns, setRandomDesigns] = useState<Design[]>([]);
  const [designerDesigns, setDesignerDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all designs with caching
   */
  const fetchDesigns = useCallback(async () => {
    try {
      setLoading(true);
      const allDesigns = await designRepository.showDesigns();
      setDesigns(allDesigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch designs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch random designs
   * These are not cached as they should be different each time
   */
  const fetchRandomDesigns = useCallback(async () => {
    try {
      setLoading(true);
      const designs = await designRepository.getRandomDesigns();
      setRandomDesigns(designs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch random designs",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch designs by designer with caching
   * @param designerId - ID of the designer whose designs to fetch
   */
  const fetchDesignerDesigns = useCallback(async (designerId: string) => {
    try {
      setLoading(true);
      const designs = await designRepository.getDesignerDesigns(designerId);
      setDesignerDesigns(designs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch designer designs",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a design
   * Also invalidates relevant caches
   *
   * @param designId - ID of design to update
   * @param data - Update data
   * @returns Updated design
   */
  const updateDesign = async (
    designId: string,
    data: UpdateDesignData,
  ): Promise<Design> => {
    try {
      setLoading(true);
      const updatedDesign = await designRepository.updateDesign(designId, data);

      // Update local state
      setDesigns((prev) =>
        prev.map((d) => (d.id === designId ? updatedDesign : d)),
      );

      if (designerDesigns.length > 0) {
        setDesignerDesigns((prev) =>
          prev.map((d) => (d.id === designId ? updatedDesign : d)),
        );
      }

      return updatedDesign;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update design");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh all design data
   */
  const refreshDesigns = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDesigns(),
        fetchRandomDesigns(),
        designerId && fetchDesignerDesigns(designerId),
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh designs",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDesigns, fetchRandomDesigns, fetchDesignerDesigns, designerId]);

  // Initial data fetch
  useEffect(() => {
    if (shouldFetchOnMount) {
      refreshDesigns();
    }
  }, [shouldFetchOnMount, refreshDesigns]);

  // Fetch designer designs when designerId changes
  useEffect(() => {
    if (designerId) {
      fetchDesignerDesigns(designerId);
    }
  }, [designerId, fetchDesignerDesigns]);

  return {
    // State
    designs,
    randomDesigns,
    designerDesigns,
    loading,
    error,

    // Methods
    fetchDesigns,
    fetchRandomDesigns,
    fetchDesignerDesigns,
    updateDesign,
    refreshDesigns,
  };
};

/**
 * Hook for managing a single design
 *
 * @param designId - ID of the design to manage
 * @returns Object containing design state and methods
 *
 * @example
 * ```tsx
 * const {
 *   design,
 *   loading,
 *   error,
 *   updateDesign
 * } = useSingleDesign('design123');
 * ```
 */
export const useSingleDesign = (designId: string) => {
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateDesign = async (data: UpdateDesignData): Promise<Design> => {
    try {
      setLoading(true);
      const updatedDesign = await designRepository.updateDesign(designId, data);
      setDesign(updatedDesign);
      return updatedDesign;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update design");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    design,
    loading,
    error,
    updateDesign,
  };
};
