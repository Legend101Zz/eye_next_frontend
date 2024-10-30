import { ApiClient } from "../client";
import { ICacheService } from "@/domain/ports/services/ICacheService";
import { IUserRepository } from "@/domain/ports/repositories/IUserRepository";
import { API_ENDPOINTS } from "../endpoints";
import {
  User,
  UserProfile,
  Address,
  CartItem,
  UserQueryParams,
  UserStats,
  WishlistItem,
  Order,
  PaginatedUsers,
  UserPreferences,
  FollowedDesigner,
} from "@/domain/entities/user.entity";

/**
 * User Repository Implementation
 * Handles all user-related data operations with caching
 */
export class UserRepository implements IUserRepository {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly cacheService: ICacheService,
  ) {}

  /**
   * Find user by ID
   *
   * @param id - User ID
   * @returns Promise resolving to user
   * @throws {NotFoundError} If user doesn't exist
   *
   * @example
   * ```typescript
   * const user = await userRepo.findById('user123');
   * console.log(user.profile);
   * ```
   */
  async findById(id: string): Promise<User> {
    const cacheKey = `user:${id}`;

    try {
      const cached = await this.cacheService.get<User>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<User>(
        API_ENDPOINTS.USERS.BY_ID(id),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800, // 30 minutes
        tags: ["users", `user:${id}`],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update user profile
   *
   * @param userId - User ID
   * @param profile - Updated profile data
   * @returns Promise resolving to updated user
   * @throws {ValidationError} If profile data is invalid
   */
  async updateProfile(
    userId: string,
    profile: Partial<UserProfile>,
  ): Promise<User> {
    try {
      const response = await this.apiClient.post<User>(
        API_ENDPOINTS.USERS.PROFILE(userId),
        profile,
      );

      // Invalidate user caches
      await this.cacheService.deleteByTags([`user:${userId}`]);

      return response;
    } catch (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Add address to user profile
   *
   * @param userId - User ID
   * @param address - Address to add
   * @returns Promise resolving to updated user
   */
  async addAddress(
    userId: string,
    address: Omit<Address, "id">,
  ): Promise<User> {
    try {
      const response = await this.apiClient.post<User>(
        `${API_ENDPOINTS.USERS.BY_ID(userId)}/addresses`,
        address,
      );

      await this.cacheService.deleteByTags([`user:${userId}`]);

      return response;
    } catch (error) {
      console.error(`Error adding address for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user address
   *
   * @param userId - User ID
   * @param addressId - Address ID
   * @param address - Updated address data
   * @returns Promise resolving to updated user
   */
  async updateAddress(
    userId: string,
    addressId: string,
    address: Partial<Address>,
  ): Promise<User> {
    try {
      const response = await this.apiClient.post<User>(
        `${API_ENDPOINTS.USERS.BY_ID(userId)}/addresses/${addressId}`,
        address,
      );

      await this.cacheService.deleteByTags([`user:${userId}`]);

      return response;
    } catch (error) {
      console.error(
        `Error updating address ${addressId} for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Delete user address
   *
   * @param userId - User ID
   * @param addressId - Address ID
   * @returns Promise resolving to updated user
   */
  async deleteAddress(userId: string, addressId: string): Promise<User> {
    try {
      const response = await this.apiClient.delete<User>(
        `${API_ENDPOINTS.USERS.BY_ID(userId)}/addresses/${addressId}`,
      );

      await this.cacheService.deleteByTags([`user:${userId}`]);

      return response;
    } catch (error) {
      console.error(
        `Error deleting address ${addressId} for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Add item to user's cart
   *
   * @param userId - User ID
   * @param item - Cart item to add
   * @returns Promise resolving to updated cart
   */
  async addToCart(
    userId: string,
    item: Omit<CartItem, "id">,
  ): Promise<CartItem[]> {
    try {
      const response = await this.apiClient.post<CartItem[]>(
        API_ENDPOINTS.USERS.CART(userId),
        item,
      );

      await this.cacheService.deleteByTags([`user:${userId}`, "cart"]);

      return response;
    } catch (error) {
      console.error(`Error adding item to cart for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   *
   * @param userId - User ID
   * @param itemId - Cart item ID
   * @param quantity - New quantity
   * @returns Promise resolving to updated cart
   */
  async updateCartItemQuantity(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartItem[]> {
    try {
      const response = await this.apiClient.post<CartItem[]>(
        `${API_ENDPOINTS.USERS.CART(userId)}/${itemId}`,
        { quantity },
      );

      await this.cacheService.deleteByTags([`user:${userId}`, "cart"]);

      return response;
    } catch (error) {
      console.error(
        `Error updating cart item quantity for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Remove item from cart
   *
   * @param userId - User ID
   * @param itemId - Cart item ID
   * @returns Promise resolving to updated cart
   */
  async removeFromCart(userId: string, itemId: string): Promise<CartItem[]> {
    try {
      const response = await this.apiClient.delete<CartItem[]>(
        `${API_ENDPOINTS.USERS.CART(userId)}/${itemId}`,
      );

      await this.cacheService.deleteByTags([`user:${userId}`, "cart"]);

      return response;
    } catch (error) {
      console.error(`Error removing item from cart for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's cart
   *
   * @param userId - User ID
   * @returns Promise resolving to cart items
   */
  async getCart(userId: string): Promise<CartItem[]> {
    const cacheKey = `user:${userId}:cart`;

    try {
      const cached = await this.cacheService.get<CartItem[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<CartItem[]>(
        API_ENDPOINTS.USERS.CART(userId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`user:${userId}`, "cart"],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching cart for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Follow a designer
   *
   * @param userId - User ID
   * @param designerId - Designer ID to follow
   * @returns Promise resolving when complete
   */
  async followDesigner(userId: string, designerId: string): Promise<void> {
    try {
      await this.apiClient.post(
        API_ENDPOINTS.USERS.FOLLOW_DESIGNER(designerId),
      );

      // Invalidate relevant caches
      await this.cacheService.deleteByTags([
        `user:${userId}`,
        `designer:${designerId}`,
        "following",
      ]);
    } catch (error) {
      console.error(
        `Error following designer ${designerId} for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Unfollow a designer
   *
   * @param userId - User ID
   * @param designerId - Designer ID to unfollow
   * @returns Promise resolving when complete
   */
  async unfollowDesigner(userId: string, designerId: string): Promise<void> {
    try {
      await this.apiClient.delete(
        API_ENDPOINTS.USERS.UNFOLLOW_DESIGNER(designerId),
      );

      await this.cacheService.deleteByTags([
        `user:${userId}`,
        `designer:${designerId}`,
        "following",
      ]);
    } catch (error) {
      console.error(
        `Error unfollowing designer ${designerId} for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get followed designers
   *
   * @param userId - User ID
   * @returns Promise resolving to followed designers
   */
  async getFollowedDesigners(userId: string): Promise<FollowedDesigner[]> {
    const cacheKey = `user:${userId}:following`;

    try {
      const cached = await this.cacheService.get<FollowedDesigner[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<FollowedDesigner[]>(
        `${API_ENDPOINTS.USERS.BY_ID(userId)}/following`,
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 1800,
        tags: [`user:${userId}`, "following"],
      });

      return response;
    } catch (error) {
      console.error(
        `Error fetching followed designers for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get user's order history
   *
   * @param userId - User ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise resolving to paginated orders
   */
  async getOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const cacheKey = `user:${userId}:orders:${page}:${limit}`;

    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get(
        API_ENDPOINTS.USERS.ORDERS(userId),
        { params: { page, limit } },
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: [`user:${userId}`, "orders"],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user preferences
   *
   * @param userId - User ID
   * @param preferences - Updated preferences
   * @returns Promise resolving to updated user
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>,
  ): Promise<User> {
    try {
      const response = await this.apiClient.post<User>(
        `${API_ENDPOINTS.USERS.BY_ID(userId)}/preferences`,
        preferences,
      );

      await this.cacheService.deleteByTags([`user:${userId}`]);

      return response;
    } catch (error) {
      console.error(`Error updating preferences for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's wishlist
   *
   * @param userId - User ID
   * @returns Promise resolving to wishlist items
   */
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    const cacheKey = `user:${userId}:wishlist`;

    try {
      const cached = await this.cacheService.get<WishlistItem[]>(cacheKey);
      if (cached) return cached;

      const response = await this.apiClient.get<WishlistItem[]>(
        API_ENDPOINTS.USERS.WISHLIST(userId),
      );

      await this.cacheService.set(cacheKey, response, {
        ttl: 3600,
        tags: [`user:${userId}`, "wishlist"],
      });

      return response;
    } catch (error) {
      console.error(`Error fetching wishlist for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Add item to wishlist
   *
   * @param userId - User ID
   * @param productId - Product ID to add
   * @returns Promise resolving to updated wishlist
   */
  async addToWishlist(
    userId: string,
    productId: string,
  ): Promise<WishlistItem[]> {
    try {
      const response = await this.apiClient.post<WishlistItem[]>(
        API_ENDPOINTS.USERS.WISHLIST(userId),
        { productId },
      );

      await this.cacheService.deleteByTags([`user:${userId}`, "wishlist"]);

      return response;
    } catch (error) {
      console.error(`Error adding item to wishlist for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove item from wishlist
   *
   * @param userId - User ID
   * @param productId - Product ID to remove
   * @returns Promise resolving to updated wishlist
   */
  async removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<WishlistItem[]> {
    try {
      const response = await this.apiClient.delete<WishlistItem[]>(
        `${API_ENDPOINTS.USERS.WISHLIST(userId)}/${productId}`,
      );

      await this.cacheService.deleteByTags([`user:${userId}`, "wishlist"]);

      return response;
    } catch (error) {
      console.error(
        `Error removing item from wishlist for user ${userId}:`,
        error,
      );
      throw error;
    }
  }
}
