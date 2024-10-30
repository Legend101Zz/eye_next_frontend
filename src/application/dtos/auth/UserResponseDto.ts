/**
 * Data Transfer Object for user response data
 * Maps AuthUser domain entity to client-safe user data
 * Used for API responses and client-side state
 *
 * @example
 * ```typescript
 * const userResponse: UserResponseDto = {
 *   id: "user123",
 *   email: "user@example.com",
 *   name: "John Doe",
 *   isDesigner: false,
 *   roles: ["user"],
 *   profile: {
 *     avatarUrl: "avatar-url",
 *     bio: "User bio"
 *   }
 * };
 * ```
 */
export interface UserResponseDto {
  /** User's unique identifier */
  id: string;

  /** User's email address */
  email: string;

  /** User's full name */
  name?: string;

  /** Whether user is a designer */
  isDesigner: boolean;

  /** Designer ID if applicable */
  designerId?: string;

  /** User roles/permissions */
  roles: string[];

  /** Authentication token if included */
  token?: {
    /** JWT access token */
    accessToken: string;
    /** Token expiration timestamp */
    expiresAt: number;
  };

  /** User profile information */
  profile?: {
    /** Profile picture URL */
    avatarUrl?: string;
    /** User biography */
    bio?: string;
    /** User location */
    location?: string;
    /** Social media links */
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      website?: string;
    };
  };

  /** Account status information */
  status: {
    /** Email verification status */
    emailVerified: boolean;
    /** Account creation date */
    createdAt: Date;
    /** Last login date */
    lastLoginAt?: Date;
    /** Account type */
    accountType: "basic" | "premium" | "designer";
  };

  /** User preferences */
  preferences?: {
    /** Email notification settings */
    emailNotifications: boolean;
    /** Theme preference */
    theme: "light" | "dark" | "system";
    /** Language preference */
    language: string;
  };
}

// Additional types for validation and responses

/**
 * Validation error response for auth operations
 */
export interface AuthValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Auth operation response wrapper
 */
export interface AuthResponse<T> {
  success: boolean;
  data?: T;
  errors?: AuthValidationError[];
  message?: string;
}

/**
 * Session information response
 */
export interface SessionInfoDto {
  userId: string;
  token: string;
  expiresAt: number;
  refreshToken?: string;
}
