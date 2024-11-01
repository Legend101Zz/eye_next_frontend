import { useCallback, useEffect, useState } from "react";
import { FinalProductRepository } from "@/infrastructure/api/repositories/finalProductRepository";
import { ApiClient } from "@/infrastructure/api/client";
import { CacheService } from "@/infrastructure/cache/cacheService";
import {
  GroupedProduct,
  IFinalProductResponse,
} from "@/domain/entities/finalProduct.entity";
import { FinalProductQueryParams } from "@/domain/ports/repositories/IFinalProductRepository";
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

const finalProductRepository = new FinalProductRepository(
  apiClient,
  cacheService,
);

interface UseFinalProductsParams {
  initialParams?: FinalProductQueryParams;
  shouldFetchOnMount?: boolean;
}

/**
 * Custom hook for managing final products
 * Provides product fetching, creation, and caching functionality
 *
 * @param params - Configuration parameters for the hook
 * @returns Object containing product state and methods
 *
 * @example
 * ```tsx
 * const {
 *   products,
 *   loading,
 *   error,
 *   createProduct,
 *   fetchProducts
 * } = useFinalProducts({
 *   initialParams: { category: 'tshirts' },
 *   shouldFetchOnMount: true
 * });
 * ```
 */
export const useFinalProducts = ({
  initialParams = {},
  shouldFetchOnMount = true,
}: UseFinalProductsParams = {}) => {
  // State
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [latestProducts, setLatestProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [queryParams, setQueryParams] =
    useState<FinalProductQueryParams>(initialParams);

  /**
   * Fetch products with given parameters
   */
  const fetchProducts = useCallback(
    async (params: FinalProductQueryParams = queryParams) => {
      try {
        setLoading(true);
        const response = await finalProductRepository.getProducts(params);
        setProducts(response);
        setQueryParams(params);
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [queryParams],
  );

  /**
   * Create a new final product
   */
  const createProduct = async (data: any, files: File[]) => {
    try {
      setLoading(true);
      const newProduct = await finalProductRepository.createFinalProduct(
        data,
        files,
      );

      // Update products list if the new product matches current query params
      if (matchesQueryParams(newProduct, queryParams)) {
        setProducts((prev) => [...prev, groupProduct(newProduct)]);
      }

      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch latest products
   */
  const fetchLatestProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await finalProductRepository.getLatestProducts();
      setLatestProducts(response);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch latest products",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update query parameters and fetch products
   */
  const updateQueryParams = async (
    newParams: Partial<FinalProductQueryParams>,
  ) => {
    const updatedParams = { ...queryParams, ...newParams };
    await fetchProducts(updatedParams);
  };

  /**
   * Refresh all product data
   */
  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchLatestProducts()]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh products",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchLatestProducts]);

  // Initial data fetch
  useEffect(() => {
    if (shouldFetchOnMount) {
      refreshProducts();
    }
  }, [shouldFetchOnMount, refreshProducts]);

  return {
    // State
    products,
    latestProducts,
    loading,
    error,
    queryParams,

    // Methods
    fetchProducts,
    createProduct,
    fetchLatestProducts,
    updateQueryParams,
    refreshProducts,
  };
};

/**
 * Hook for managing a single final product
 *
 * @param productId - ID of the product to manage
 * @returns Object containing product state and methods
 *
 * @example
 * ```tsx
 * const {
 *   product,
 *   loading,
 *   error,
 *   refreshProduct
 * } = useSingleProduct('product123');
 * ```
 */
export const useSingleProduct = (productId?: string) => {
  const [product, setProduct] = useState<IFinalProductResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const response = await finalProductRepository.getSingleProduct(productId);
      setProduct(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Initial fetch
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refreshProduct: fetchProduct,
  };
};

// Helper functions
const matchesQueryParams = (
  product: IFinalProductResponse,
  params: FinalProductQueryParams,
): boolean => {
  if (params.category && product.category !== params.category) return false;
  // Add more parameter matching logic as needed
  return true;
};

const groupProduct = (product: IFinalProductResponse): GroupedProduct => {
  return {
    productName: product.productName,
    productId: product.productId,
    baseProductName: product.baseProductName,
    mainImageUrl: product.mainImageUrl,
    otherImages: product.otherImages,
    price: product.price,
    category: product.category,
    sales: product.sales,
    designs: product.designs,
    // Group colors - initially just includes the current color
    colors: [
      {
        color: product.color,
        productId: product.productId,
      },
    ],
  };
};
