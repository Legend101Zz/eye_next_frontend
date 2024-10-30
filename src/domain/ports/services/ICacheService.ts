/**
 * Cache item metadata for tracking and management
 */
export interface CacheMetadata {
  /** Timestamp when the item was cached */
  createdAt: Date;

  /** Timestamp when the item expires */
  expiresAt?: Date;

  /** Number of times this item has been accessed */
  hits: number;

  /** Last accessed timestamp */
  lastAccessed: Date;

  /** Size of the cached data in bytes */
  size: number;

  /** Tags for categorizing and bulk operations */
  tags: string[];
}

/**
 * Cache entry including value and metadata
 */
export interface CacheEntry<T> {
  value: T;
  metadata: CacheMetadata;
}

/**
 * Configuration options for cache operations
 */
export interface CacheOptions {
  /** Time-to-live in seconds */
  ttl?: number;

  /** Tags for categorizing the cached item */
  tags?: string[];

  /** Priority for cache eviction (0-100) */
  priority?: number;

  /** Whether to refresh TTL on access */
  refreshOnAccess?: boolean;

  /** Whether to compress the data */
  compress?: boolean;
}

/**
 * Statistics about cache usage
 */
export interface CacheStats {
  /** Total number of items in cache */
  size: number;

  /** Total size in bytes */
  bytesUsed: number;

  /** Number of cache hits */
  hits: number;

  /** Number of cache misses */
  misses: number;

  /** Hit rate percentage */
  hitRate: number;

  /** Items grouped by tags */
  tagStats: Record<string, number>;
}

/**
 * Cache Service Interface
 * Provides caching functionality optimized for e-commerce and design operations
 */
export interface ICacheService {
  /**
   * Store a value in the cache
   *
   * @param key - Unique identifier for the cached item
   * @param value - Value to cache
   * @param options - Caching options
   * @throws {CacheError} If storage fails
   *
   * @example
   * ```typescript
   * // Cache product listing with tags
   * await cache.set('products:featured', products, {
   *   ttl: 3600,
   *   tags: ['products', 'featured'],
   *   priority: 80
   * });
   *
   * // Cache design preview with compression
   * await cache.set(`design:preview:${designId}`, previewData, {
   *   ttl: 7200,
   *   tags: ['designs', 'previews'],
   *   compress: true
   * });
   * ```
   */
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;

  /**
   * Retrieve a value from the cache
   *
   * @param key - Key of the item to retrieve
   * @returns Promise resolving to the cached value or null if not found
   * @throws {CacheError} If retrieval fails
   *
   * @example
   * ```typescript
   * // Get cached product listing
   * const products = await cache.get('products:featured');
   * if (!products) {
   *   // Fetch from database if not cached
   * }
   * ```
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Check if a key exists in the cache
   *
   * @param key - Key to check
   * @returns Promise resolving to boolean
   */
  has(key: string): Promise<boolean>;

  /**
   * Delete an item from the cache
   *
   * @param key - Key to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(key: string): Promise<boolean>;

  /**
   * Delete all items matching given tags
   *
   * @param tags - Tags to match for deletion
   * @returns Promise resolving to number of items deleted
   *
   * @example
   * ```typescript
   * // Invalidate all product caches
   * await cache.deleteByTags(['products']);
   *
   * // Invalidate specific designer's designs
   * await cache.deleteByTags(['designs', `designer:${designerId}`]);
   * ```
   */
  deleteByTags(tags: string[]): Promise<number>;

  /**
   * Get multiple values from cache
   *
   * @param keys - Array of keys to retrieve
   * @returns Promise resolving to map of found values
   *
   * @example
   * ```typescript
   * // Get multiple product previews
   * const previews = await cache.getMany([
   *   `preview:${id1}`,
   *   `preview:${id2}`
   * ]);
   * ```
   */
  getMany<T>(keys: string[]): Promise<Map<string, T>>;

  /**
   * Store multiple values in cache
   *
   * @param entries - Map of key-value pairs to cache
   * @param options - Cache options
   * @returns Promise resolving when complete
   */
  setMany<T>(entries: Map<string, T>, options?: CacheOptions): Promise<void>;

  /**
   * Get cache statistics
   *
   * @returns Promise resolving to cache statistics
   */
  getStats(): Promise<CacheStats>;

  /**
   * Get metadata for a cached item
   *
   * @param key - Key to get metadata for
   * @returns Promise resolving to metadata or null if not found
   */
  getMetadata(key: string): Promise<CacheMetadata | null>;

  /**
   * Clear all cached items
   *
   * @returns Promise resolving when complete
   */
  clear(): Promise<void>;

  /**
   * Get all keys matching a pattern
   *
   * @param pattern - Pattern to match (e.g., "product:*")
   * @returns Promise resolving to matching keys
   */
  keys(pattern: string): Promise<string[]>;

  /**
   * Update item TTL
   *
   * @param key - Key to update
   * @param ttl - New TTL in seconds
   * @returns Promise resolving to boolean indicating success
   */
  updateTTL(key: string, ttl: number): Promise<boolean>;
}

/**
 * Cache Key Patterns
 * Common key patterns for different types of cached data
 */
export const CacheKeys = {
  // Product related
  PRODUCT_DETAIL: (id: string) => `product:${id}`,
  PRODUCT_LISTING: (page: number) => `products:list:${page}`,
  PRODUCT_SEARCH: (query: string) => `products:search:${query}`,
  PRODUCT_CATEGORY: (category: string) => `products:category:${category}`,

  // Design related
  DESIGN_DETAIL: (id: string) => `design:${id}`,
  DESIGN_PREVIEW: (id: string) => `design:preview:${id}`,
  DESIGN_LISTING: (designerId: string) => `designs:designer:${designerId}`,

  // User related
  USER_PROFILE: (id: string) => `user:${id}`,
  USER_DESIGNS: (id: string) => `user:${id}:designs`,

  // Shopping related
  CART: (userId: string) => `cart:${userId}`,
  WISHLIST: (userId: string) => `wishlist:${userId}`,

  // Analytics and stats
  TRENDING_DESIGNS: "analytics:trending:designs",
  BEST_SELLERS: "analytics:bestsellers",
  DESIGNER_STATS: (id: string) => `stats:designer:${id}`,
} as const;

/**
 * Cache Tags
 * Common tags for grouping cached items
 */
export const CacheTags = {
  PRODUCTS: "products",
  DESIGNS: "designs",
  USERS: "users",
  PREVIEWS: "previews",
  ANALYTICS: "analytics",
  DESIGNER: (id: string) => `designer:${id}`,
  CATEGORY: (category: string) => `category:${category}`,
} as const;
