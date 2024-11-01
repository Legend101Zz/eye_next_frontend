import { IBaseRepository } from "./IBaseRepository";
import { User, Address, CartItem } from "@/domain/entities/user.entity";
import { UserCredentials } from "@/domain/entities/auth.entity";

/**
 * User Repository Interface
 * Handles all user-related data persistence operations
 */
export interface IUserRepository extends IBaseRepository<User> {
  /**
   * Create a new user account
   *
   * @param credentials - User credentials and profile data
   * @returns Promise resolving to created user
   * @throws {ValidationError} If data is invalid
   * @throws {DuplicateEmailError} If email already exists
   */
  createUser(credentials: UserCredentials): Promise<User>;

  /**
   * Authenticate user login
   *
   * @param email - User's email
   * @param password - User's password
   * @returns Promise resolving to authenticated user or null
   * @throws {AuthenticationError} If credentials are invalid
   */
  loginUser(email: string, password: string): Promise<User | null>;

  /**
   * Update user's password
   *
   * @param userId - User ID
   * @param newPassword - New password
   * @returns Promise resolving to updated user
   * @throws {NotFoundError} If user doesn't exist
   */
  updatePassword(userId: string, newPassword: string): Promise<User>;

  /**
   * Update user profile information
   *
   * @param userId - User ID
   * @param data - Profile data to update
   * @returns Promise resolving to updated user
   * @throws {NotFoundError} If user doesn't exist
   */
  updateUser(userId: string, data: Partial<User>): Promise<User>;

  /**
   * Get basic user information
   *
   * @param userId - User ID
   * @returns Promise resolving to user info
   * @throws {NotFoundError} If user doesn't exist
   */
  getUserInfo(userId: string): Promise<User>;

  /**
   * Find user by email
   *
   * @param email - Email to search for
   * @returns Promise resolving to user or null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find user by Google ID
   *
   * @param googleId - Google ID to search for
   * @returns Promise resolving to user or null
   */
  findByGoogleId(googleId: string): Promise<User | null>;

  /**
   * Add address to user profile
   *
   * @param userId - User ID
   * @param address - Address to add
   * @returns Promise resolving to updated user
   * @throws {NotFoundError} If user doesn't exist
   * @throws {ValidationError} If address data is invalid
   */
  addAddress(userId: string, address: Omit<Address, "id">): Promise<void>;

  /**
   * Get user's addresses
   *
   * @param userId - User ID
   * @param type - Optional address type filter
   * @returns Promise resolving to addresses
   * @throws {NotFoundError} If user doesn't exist
   */
  getAddresses(userId: string, type?: string): Promise<Address[]>;

  /**
   * Add item to user's cart
   *
   * @param userId - User ID
   * @param productId - Product ID to add
   * @param quantity - Quantity to add
   * @returns Promise resolving to updated user
   */
  addToCart(userId: string, productId: string, quantity: number): Promise<void>;

  /**
   * Get user's cart contents
   *
   * @param userId - User ID
   * @returns Promise resolving to cart items
   * @throws {NotFoundError} If user doesn't exist
   */
  getUserCart(userId: string): Promise<CartItem[]>;

  /**
   * Update cart item quantity
   *
   * @param userId - User ID
   * @param productId - Product ID to update
   * @param quantity - New quantity
   * @returns Promise resolving to updated user
   */
  updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<void>;

  /**
   * Remove item from cart
   *
   * @param userId - User ID
   * @param productId - Product ID to remove
   * @returns Promise resolving to updated user
   */
  removeFromCart(userId: string, productId: string): Promise<void>;

  /**
   * Follow a designer
   *
   * @param userId - User ID
   * @param designerId - Designer ID to follow
   * @returns Promise resolving to updated user
   * @throws {NotFoundError} If user or designer doesn't exist
   * @throws {ValidationError} If already following
   */
  followDesigner(userId: string, designerId: string): Promise<void>;

  /**
   * Unfollow a designer
   *
   * @param userId - User ID
   * @param designerId - Designer ID to unfollow
   * @returns Promise resolving to updated user
   * @throws {NotFoundError} If user or designer doesn't exist
   * @throws {ValidationError} If not following
   */
  unfollowDesigner(userId: string, designerId: string): Promise<void>;
}
