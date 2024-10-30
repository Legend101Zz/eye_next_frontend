/**
 * Wishlist Data Transfer Objects (DTOs)
 * These DTOs handle wishlist-related data transformations between
 * the presentation and domain layers.
 *
 * @module user/dtos
 */

/**
 * Wishlist item response DTO
 * Represents an item in user's wishlist
 *
 * @example
 * ```typescript
 * const wishlistItem: WishlistItemDto = {
 *   id: "wish123",
 *   product: {
 *     id: "prod123",
 *     name: "Artist T-Shirt"
 *   },
 *   addedAt: 1234567890
 * };
 * ```
 */
export interface WishlistItemDto {
  /** Wishlist item unique identifier */
  id: string;
  /** Product information */
  product: {
    /** Product ID */
    id: string;
    /** Product name */
    name: string;
    /** Product category */
    category: string;
    /** Main image URL */
    imageUrl: string;
    /** Current price */
    price: number;
    /** Original price if on sale */
    originalPrice?: number;
    /** Whether product is in stock */
    inStock: boolean;
    /** Whether product is on sale */
    onSale: boolean;
  };
  /** Design information if applicable */
  design?: {
    /** Design ID */
    id: string;
    /** Design name */
    name: string;
    /** Designer ID */
    designerId: string;
    /** Designer name */
    designerName: string;
  };
  /** Selected options */
  options?: {
    /** Selected size if applicable */
    size?: string;
    /** Selected color if applicable */
    color?: string;
    /** Other product-specific options */
    [key: string]: string | undefined;
  };
  /** When item was added */
  addedAt: number;
  /** Price when item was added */
  priceWhenAdded: number;
  /** Notes added by user */
  notes?: string;
}

/**
 * Wishlist response DTO
 * Represents complete wishlist information
 */
export interface WishlistDto {
  /** User ID */
  userId: string;
  /** Wishlist items */
  items: WishlistItemDto[];
  /** Last update timestamp */
  updatedAt: number;
  /** Wishlist statistics */
  stats: {
    /** Total items count */
    totalItems: number;
    /** Total value of items */
    totalValue: number;
    /** Number of items on sale */
    onSaleCount: number;
    /** Number of out of stock items */
    outOfStockCount: number;
  };
}

/**
 * Add to wishlist request DTO
 * Used when adding item to wishlist
 *
 * @example
 * ```typescript
 * const addRequest: AddToWishlistRequestDto = {
 *   productId: "prod123",
 *   options: { size: "M", color: "blue" }
 * };
 * ```
 */
export interface AddToWishlistRequestDto {
  /** Product ID to add */
  productId: string;
  /** Design ID if applicable */
  designId?: string;
  /** Selected options */
  options?: {
    /** Size if applicable */
    size?: string;
    /** Color if applicable */
    color?: string;
    /** Other options */
    [key: string]: string | undefined;
  };
  /** User notes */
  notes?: string;
}

/**
 * Wishlist item update request DTO
 * Used when updating wishlist item
 */
export interface UpdateWishlistItemRequestDto {
  /** Options to update */
  options?: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
}
d;
