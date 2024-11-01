/**
 * Represents a User entity in the system.
 * Core domain model that contains essential user information and business logic.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  phone?: string;
  name?: string;
  description?: string;
  following: string[]; // Array of Designer IDs
  addresses: Address[];
  isDesigner: boolean;
  designerId?: string;
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a user's profile information.
 */
export interface UserProfile {
  /**
   * The user's phone number.
   */
  phone: string;

  /**
   * The user's full name.
   */
  name: string;

  /**
   * A brief description or bio of the user.
   */
  description: string;

  /**
   * The unique identifier for the user.
   */
  userId: string;

  /**
   * The user's unique username.
   */
  username: string;
}

/**
 * Represents a user's address information.
 */
export interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: AddressType;
  userId: string;
}

/**
 * Represents an item in user's shopping cart.
 */
export interface CartItem {
  finalProductId: string;
  quantity: number;
}

/**
 * Valid address types in the system.
 */
export enum AddressType {
  HOME = "home",
  WORK = "work",
  OTHER = "other",
}
