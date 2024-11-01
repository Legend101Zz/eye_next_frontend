import { useCallback, useEffect, useState } from "react";
import { UserRepository } from "@/infrastructure/api/repositories/userRepository";
import { ApiClient } from "@/infrastructure/api/client";
import { CacheService } from "@/infrastructure/cache/cacheService";
import {
  User,
  Address,
  CartItem,
  UserProfile,
} from "@/domain/entities/user.entity";
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

const userRepository = new UserRepository(apiClient, cacheService);

/**
 * Custom hook for managing user data and operations
 * Provides user profile management, cart operations, and following functionality
 * Implements Redis caching for optimal performance
 *
 * @returns User management methods and state
 *
 * @example
 * ```tsx
 * const {
 *   user,
 *   loading,
 *   error,
 *   cart,
 *   updateProfile,
 *   addToCart,
 *   removeFromCart,
 *   followDesigner
 * } = useUser('user123');
 *
 * if (loading) return <Loading />;
 * if (error) return <Error message={error} />;
 *
 * return (
 *   <div>
 *     <h1>Welcome {user?.profile.name}</h1>
 *     <Cart items={cart} />
 *   </div>
 * );
 * ```
 */
export const useUser = (userId?: string) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user data with caching
   */
  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = await userRepository.findById(userId);
      setUser(userData);

      // Fetch cart data
      const cartData = await userRepository.getCart(userId);
      setCart(cartData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Update user profile
   * @param profile - Updated profile data
   */
  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!userId) return;

    try {
      setLoading(true);
      const updatedUser = await userRepository.updateProfile(userId, profile);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add address to user profile
   * @param address - New address to add
   */
  const addAddress = async (address: Omit<Address, "id">) => {
    if (!userId) return;

    try {
      setLoading(true);
      await userRepository.addAddress(userId, address);
      await fetchUser(); // Refresh user data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add item to cart
   * @param productId - Product ID to add
   * @param quantity - Quantity to add
   */
  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!userId) return;

    try {
      await userRepository.addToCart(userId, productId, quantity);
      const updatedCart = await userRepository.getCart(userId);
      setCart(updatedCart);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add item to cart",
      );
      throw err;
    }
  };

  /**
   * Update cart item quantity
   * @param productId - Product ID to update
   * @param quantity - New quantity
   */
  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!userId) return;

    try {
      await userRepository.updateCartItemQuantity(userId, productId, quantity);
      const updatedCart = await userRepository.getCart(userId);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cart");
      throw err;
    }
  };

  /**
   * Remove item from cart
   * @param productId - Product ID to remove
   */
  const removeFromCart = async (productId: string) => {
    if (!userId) return;

    try {
      await userRepository.removeFromCart(userId, productId);
      const updatedCart = await userRepository.getCart(userId);
      setCart(updatedCart);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove item from cart",
      );
      throw err;
    }
  };

  /**
   * Follow a designer
   * @param designerId - Designer ID to follow
   */
  const followDesigner = async (designerId: string) => {
    if (!userId) return;

    try {
      await userRepository.followDesigner(userId, designerId);
      await fetchUser(); // Refresh user data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to follow designer",
      );
      throw err;
    }
  };

  /**
   * Unfollow a designer
   * @param designerId - Designer ID to unfollow
   */
  const unfollowDesigner = async (designerId: string) => {
    if (!userId) return;

    try {
      await userRepository.unfollowDesigner(userId, designerId);
      await fetchUser(); // Refresh user data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to unfollow designer",
      );
      throw err;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUser();
  }, [fetchUser, userId]);

  return {
    // State
    user,
    cart,
    loading,
    error,

    // Methods
    updateProfile,
    addAddress,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    followDesigner,
    unfollowDesigner,
    refreshUser: fetchUser,
  };
};
