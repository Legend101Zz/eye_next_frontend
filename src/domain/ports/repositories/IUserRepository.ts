import { IBaseRepository } from "./IBaseRepository";
import { User, Address } from "@/domain/entities/user.entity";

/**
 * User Repository Interface
 *
 * Extends the base repository interface with user-specific operations.
 * Handles all data persistence operations related to User entities,
 * including specialized queries and business logic.
 */
export interface IUserRepository extends IBaseRepository<User> {
  /**
   * Finds a user by their email address.
   *
   * @param email - The email address to search for
   * @returns Promise resolving to the found user or null if not found
   * @throws {DatabaseError} If the query operation fails
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their Google ID (for OAuth authentication).
   *
   * @param googleId - The Google ID to search for
   * @returns Promise resolving to the found user or null if not found
   * @throws {DatabaseError} If the query operation fails
   */
  findByGoogleId(googleId: string): Promise<User | null>;

  /**
   * Adds a new address to a user's profile.
   *
   * @param userId - The ID of the user to add the address to
   * @param address - The address data to add
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user doesn't exist
   * @throws {ValidationError} If the address data is invalid
   * @throws {DatabaseError} If the operation fails
   */
  addAddress(userId: string, address: Omit<Address, "id">): Promise<User>;

  /**
   * Removes an address from a user's profile.
   *
   * @param userId - The ID of the user to remove the address from
   * @param addressId - The ID of the address to remove
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user or address doesn't exist
   * @throws {DatabaseError} If the operation fails
   */
  removeAddress(userId: string, addressId: string): Promise<User>;

  /**
   * Updates an existing address in a user's profile.
   *
   * @param userId - The ID of the user whose address to update
   * @param addressId - The ID of the address to update
   * @param addressData - The new address data
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user or address doesn't exist
   * @throws {ValidationError} If the address data is invalid
   * @throws {DatabaseError} If the operation fails
   */
  updateAddress(
    userId: string,
    addressId: string,
    addressData: Partial<Address>,
  ): Promise<User>;

  /**
   * Adds an item to the user's shopping cart.
   *
   * @param userId - The ID of the user
   * @param productId - The ID of the product to add
   * @param quantity - The quantity to add
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user or product doesn't exist
   * @throws {ValidationError} If the quantity is invalid
   * @throws {DatabaseError} If the operation fails
   */
  addToCart(userId: string, productId: string, quantity: number): Promise<User>;

  /**
   * Updates the quantity of an item in the user's cart.
   *
   * @param userId - The ID of the user
   * @param productId - The ID of the product to update
   * @param quantity - The new quantity
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user or cart item doesn't exist
   * @throws {ValidationError} If the quantity is invalid
   * @throws {DatabaseError} If the operation fails
   */
  updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<User>;

  /**
   * Removes an item from the user's cart.
   *
   * @param userId - The ID of the user
   * @param productId - The ID of the product to remove
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user or cart item doesn't exist
   * @throws {DatabaseError} If the operation fails
   */
  removeFromCart(userId: string, productId: string): Promise<User>;

  /**
   * Adds a designer to the user's following list.
   *
   * @param userId - The ID of the user
   * @param designerId - The ID of the designer to follow
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user or designer doesn't exist
   * @throws {ValidationError} If the user is already following the designer
   * @throws {DatabaseError} If the operation fails
   */
  followDesigner(userId: string, designerId: string): Promise<User>;

  /**
   * Removes a designer from the user's following list.
   *
   * @param userId - The ID of the user
   * @param designerId - The ID of the designer to unfollow
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user or designer doesn't exist
   * @throws {ValidationError} If the user is not following the designer
   * @throws {DatabaseError} If the operation fails
   */
  unfollowDesigner(userId: string, designerId: string): Promise<User>;

  /**
   * Updates the user's designer status and creates associated designer profile.
   *
   * @param userId - The ID of the user to promote to designer
   * @param designerData - The initial designer profile data
   * @returns Promise resolving to the updated user
   * @throws {NotFoundError} If the user doesn't exist
   * @throws {ValidationError} If the designer data is invalid
   * @throws {DatabaseError} If the operation fails
   */
  promoteToDesigner(
    userId: string,
    designerData: Omit<Designer, "id">,
  ): Promise<User>;
}
