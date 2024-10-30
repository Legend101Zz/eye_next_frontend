/**
 * User Profile Data Transfer Objects (DTOs)
 * These DTOs handle user profile data transformations between
 * the presentation and domain layers.
 *
 * @module user/dtos
 */

/**
 * User profile response DTO
 * Represents the complete user profile information
 *
 * @example
 * ```typescript
 * const userProfile: UserProfileDto = {
 *   id: "user123",
 *   email: "user@deauth.com",
 *   profile: {
 *     name: "John Doe",
 *     picture: "https://..."
 *   }
 * };
 * ```
 */
export interface UserProfileDto {
  /** User's unique identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's profile information */
  profile: {
    /** Display name */
    name?: string;
    /** Profile picture URL */
    picture?: string;
    /** Phone number */
    phone?: string;
    /** User bio or description */
    bio?: string;
    /** Account creation date */
    createdAt: number;
    /** Last profile update date */
    updatedAt: number;
  };
  /** User's preferences */
  preferences: {
    /** Email notification settings */
    emailNotifications: boolean;
    /** Push notification settings */
    pushNotifications: boolean;
    /** Newsletter subscription status */
    newsletter: boolean;
    /** Preferred language */
    language: string;
    /** Preferred currency */
    currency: string;
  };
  /** Account status information */
  status: {
    /** Whether email is verified */
    emailVerified: boolean;
    /** Whether phone is verified */
    phoneVerified: boolean;
    /** Account active status */
    isActive: boolean;
    /** Whether user is a designer */
    isDesigner: boolean;
    /** Designer ID if applicable */
    designerId?: string;
  };
  /** User statistics */
  stats: {
    /** Total orders placed */
    totalOrders: number;
    /** Total amount spent */
    totalSpent: number;
    /** Number of designs purchased */
    designsPurchased: number;
    /** Number of reviews given */
    reviewsGiven: number;
  };
}

/**
 * Profile update request DTO
 * Used when updating user profile information
 *
 * @example
 * ```typescript
 * const updateRequest: UpdateProfileRequestDto = {
 *   name: "John Doe Updated",
 *   phone: "+1234567890"
 * };
 * ```
 */
export interface UpdateProfileRequestDto {
  /** New display name */
  name?: string;
  /** New phone number */
  phone?: string;
  /** New bio or description */
  bio?: string;
  /** Profile picture file */
  picture?: File;
  /** User preferences updates */
  preferences?: {
    /** Email notification preference */
    emailNotifications?: boolean;
    /** Push notification preference */
    pushNotifications?: boolean;
    /** Newsletter subscription preference */
    newsletter?: boolean;
    /** Language preference */
    language?: string;
    /** Currency preference */
    currency?: string;
  };
}

/**
 * Profile update response DTO
 * Returned after profile update
 */
export interface UpdateProfileResponseDto {
  /** Updated profile data */
  profile: UserProfileDto;
  /** Update timestamp */
  updatedAt: number;
  /** Changed fields */
  changes: string[];
}

/**
 * Delete account request DTO
 * Used when user requests account deletion
 */
export interface DeleteAccountRequestDto {
  /** User's password for confirmation */
  password: string;
  /** Reason for deletion */
  reason?: string;
  /** Whether to delete all user data */
  deleteAllData: boolean;
}
