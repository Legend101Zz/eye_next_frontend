import { Redis } from "ioredis";
import { LRUCache } from "lru-cache";
import {
  ICacheService,
  CacheOptions,
  CacheMetadata,
  CacheStats,
  CacheEntry,
} from "@/domain/ports/services/ICacheService";

/**
 * Cache provider interface for different storage backends
 */
interface ICacheProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(pattern: string): Promise<string[]>;
}

/**
 * Redis cache provider implementation
 */
class RedisCacheProvider implements ICacheProvider {
  constructor(private readonly client: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.client.del(key);
    return result > 0;
  }

  async clear(): Promise<void> {
    await this.client.flushdb();
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
}

/**
 * In-memory cache provider using LRU cache
 */
class MemoryCacheProvider implements ICacheProvider {
  private cache: LRUCache<string, string>;
  private readonly defaultTTL = 3600; // 1 hour

  constructor(maxSize: number = 100) {
    this.cache = new LRUCache({
      max: maxSize,
      ttl: this.defaultTTL * 1000,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.cache.set(key, value, {
      ttl: (ttl || this.defaultTTL) * 1000,
    });
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace("*", ".*"));
    return Array.from(this.cache.keys()).filter((key) => regex.test(key));
  }
}

/**
 * Main cache service implementation
 */
export class CacheService implements ICacheService {
  private provider: ICacheProvider;
  private stats: CacheStats = {
    size: 0,
    bytesUsed: 0,
    hits: 0,
    misses: 0,
    hitRate: 0,
    tagStats: {},
  };

  constructor(config?: {
    provider?: "redis" | "memory";
    redisUrl?: string;
    maxSize?: number;
  }) {
    // Initialize provider based on configuration
    if (config?.provider === "redis" && config.redisUrl) {
      const redis = new Redis(config.redisUrl);
      this.provider = new RedisCacheProvider(redis);
    } else {
      this.provider = new MemoryCacheProvider(config?.maxSize);
    }
  }

  /**
   * Store a value in the cache
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {},
  ): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        value,
        metadata: {
          createdAt: new Date(),
          expiresAt: options.ttl
            ? new Date(Date.now() + options.ttl * 1000)
            : undefined,
          hits: 0,
          lastAccessed: new Date(),
          size: JSON.stringify(value).length,
          tags: options.tags || [],
        },
      };

      // Store the entry with metadata
      await this.provider.set(key, JSON.stringify(entry), options.ttl);

      // Update stats
      this.stats.size++;
      this.stats.bytesUsed += entry.metadata.size;
      entry.metadata.tags.forEach((tag) => {
        this.stats.tagStats[tag] = (this.stats.tagStats[tag] || 0) + 1;
      });
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      throw new Error(`Failed to set cache value for key ${key}`);
    }
  }

  /**
   * Check if a key exists in cache
   */
  async has(key: string): Promise<boolean> {
    try {
      return await this.provider.has(key);
    } catch (error) {
      console.error(`Cache has error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete an item from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const deleted = await this.provider.delete(key);
      if (deleted) {
        this.stats.size--;
        // Update tag stats if metadata available
        const metadata = await this.getMetadata(key);
        if (metadata) {
          metadata.tags.forEach((tag) => {
            this.stats.tagStats[tag]--;
          });
        }
      }
      return deleted;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Store multiple values in cache
   */
  async setMany<T>(
    entries: Map<string, T>,
    options?: CacheOptions,
  ): Promise<void> {
    await Promise.all(
      Array.from(entries.entries()).map(([key, value]) =>
        this.set(key, value, options),
      ),
    );
  }

  /**
   * Get metadata for a cached item
   */
  async getMetadata(key: string): Promise<CacheMetadata | null> {
    try {
      const rawEntry = await this.provider.get(key);
      if (!rawEntry) return null;

      const entry: CacheEntry<any> = JSON.parse(rawEntry);
      return entry.metadata;
    } catch (error) {
      console.error(`Get metadata error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Clear all cached items
   */
  async clear(): Promise<void> {
    try {
      await this.provider.clear();
      this.stats = {
        size: 0,
        bytesUsed: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
        tagStats: {},
      };
    } catch (error) {
      console.error("Cache clear error:", error);
      throw new Error("Failed to clear cache");
    }
  }

  /**
   * Get all keys matching a pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.provider.keys(pattern);
    } catch (error) {
      console.error(`Cache keys error for pattern ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Update item TTL
   */
  async updateTTL(key: string, ttl: number): Promise<boolean> {
    try {
      const rawEntry = await this.provider.get(key);
      if (!rawEntry) return false;

      const entry: CacheEntry<any> = JSON.parse(rawEntry);
      entry.metadata.expiresAt = new Date(Date.now() + ttl * 1000);

      await this.provider.set(key, JSON.stringify(entry), ttl);
      return true;
    } catch (error) {
      console.error(`Update TTL error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Retrieve a value from the cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const rawEntry = await this.provider.get(key);
      if (!rawEntry) {
        this.stats.misses++;
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(rawEntry);

      // Check if expired
      if (
        entry.metadata.expiresAt &&
        new Date(entry.metadata.expiresAt) < new Date()
      ) {
        await this.delete(key);
        this.stats.misses++;
        return null;
      }

      // Update metadata
      entry.metadata.hits++;
      entry.metadata.lastAccessed = new Date();
      await this.provider.set(key, JSON.stringify(entry));

      this.stats.hits++;
      this.updateHitRate();

      return entry.value;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete items by tags
   */
  async deleteByTags(tags: string[]): Promise<number> {
    try {
      let deletedCount = 0;
      const allKeys = await this.keys("*");

      for (const key of allKeys) {
        const entry = await this.provider.get(key);
        if (!entry) continue;

        const parsed: CacheEntry<any> = JSON.parse(entry);
        if (tags.some((tag) => parsed.metadata.tags.includes(tag))) {
          await this.delete(key);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error("Delete by tags error:", error);
      return 0;
    }
  }

  /**
   * Get multiple values from cache
   */
  async getMany<T>(keys: string[]): Promise<Map<string, T>> {
    const result = new Map<string, T>();
    await Promise.all(
      keys.map(async (key) => {
        const value = await this.get<T>(key);
        if (value !== null) {
          result.set(key, value);
        }
      }),
    );
    return result;
  }

  /**
   * Update cache hit rate
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    return { ...this.stats };
  }
}

// Export default instance
export const cacheService = new CacheService({
  provider: (process.env.CACHE_PROVIDER as "redis" | "memory") || "memory",
  redisUrl: process.env.REDIS_URL,
  maxSize: parseInt(process.env.CACHE_MAX_SIZE || "1000"),
});
