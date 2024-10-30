import { ICacheService } from "@/domain/ports/services/ICacheService";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import { CacheService } from "../cache/cacheService";

/**
 * Base API Client Implementation
 * src/infrastructure/api/client.ts
 */

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * API Error structure
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Request options extending Axios config
 */
export interface RequestOptions extends AxiosRequestConfig {
  useCache?: boolean;
  cacheTTL?: number;
  retryAttempts?: number;
}

/**
 * API Client for handling HTTP requests
 */
export class ApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly cacheService?: ICacheService;

  constructor(config: { baseURL: string; cacheService?: ICacheService }) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.cacheService = config.cacheService;

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Get auth token from session if available
        const session = await getSession();
        if (session?.accessToken) {
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new ApiError(
            error.response.status,
            error.response.data.message || "An error occurred",
            error.response.data.details,
          );
        }
        throw error;
      },
    );
  }

  /**
   * Make a GET request
   *
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns Promise resolving to response data
   *
   * @example
   * ```typescript
   * const products = await apiClient.get<Product[]>('/products', {
   *   useCache: true,
   *   cacheTTL: 3600,
   *   params: { category: 'tshirts' }
   * });
   * ```
   */
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const cacheKey = options.useCache
      ? this.generateCacheKey(url, options)
      : null;

    // Try to get from cache first
    if (cacheKey && this.cacheService) {
      const cachedData = await this.cacheService.get<T>(cacheKey);
      if (cachedData) return cachedData;
    }

    const response = await this.axiosInstance.get<ApiResponse<T>>(url, options);

    // Cache the response if needed
    if (cacheKey && this.cacheService) {
      await this.cacheService.set(cacheKey, response.data.data, {
        ttl: options.cacheTTL,
      });
    }

    return response.data.data;
  }

  /**
   * Make a POST request
   *
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  async post<T>(
    url: string,
    data: any,
    options: RequestOptions = {},
  ): Promise<T> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(
      url,
      data,
      options,
    );
    return response.data.data;
  }

  /**
   * Make a PUT request
   *
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  async put<T>(
    url: string,
    data: any,
    options: RequestOptions = {},
  ): Promise<T> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(
      url,
      data,
      options,
    );
    return response.data.data;
  }

  /**
   * Make a DELETE request
   *
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(
      url,
      options,
    );
    return response.data.data;
  }

  /**
   * Generate cache key from URL and parameters
   */
  private generateCacheKey(url: string, options: RequestOptions): string {
    const params = options.params ? JSON.stringify(options.params) : "";
    return `api:${url}:${params}`;
  }
}

/**
 * API Client instance for the application
 */
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  cacheService: new CacheService(),
});
