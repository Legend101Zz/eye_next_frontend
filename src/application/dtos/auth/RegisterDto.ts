/**
 * Registration Data Transfer Objects (DTOs)
 * These DTOs handle user registration data transformations between
 * the presentation layer and domain layer.
 *
 * @module auth/dtos
 */

import { AuthErrorCode } from "../common/errors";

/**
 * Registration request payload
 * Used when a new user signs up for an account
 *
 * @example
 * ```typescript
 * const registerRequest: RegisterRequestDto = {
 *   email: "newartist@deauth.com",
 *   password: "secure123",
 *   name: "John Artist",
 *   acceptTerms: true
 * };
 * ```
 */
export interface RegisterRequestDto {
  /** User's email address */
  email: string;
  /** User's chosen password (will be hashed) */
  password: string;
  /** User's display name */
  name?: string;
  /** User's chosen username (optional) */
  username?: string;
  /** User's phone number (optional) */
  phone?: string;
  /** Acceptance of terms and conditions */
  acceptTerms: boolean;
  /** Whether user wants to register as designer */
  isDesigner?: boolean;
  /** Initial profile data if registering as designer */
  designerProfile?: {
    /** Artist/brand name */
    artistName: string;
    /** Short bio or description */
    description?: string;
    /** Portfolio or social media links */
    links?: string[];
  };
}

/**
 * Successful registration response
 * Returned after successful user creation
 *
 * @example
 * ```typescript
 * const registerResponse: RegisterResponseDto = {
 *   user: {
 *     id: "user123",
 *     email: "newartist@deauth.com"
 *   },
 *   verification: {
 *     required: true,
 *     emailSent: true
 *   }
 * };
 * ```
 */
export interface RegisterResponseDto {
  /** Created user information */
  user: {
    /** User's unique identifier */
    id: string;
    /** User's email address */
    email: string;
    /** User's display name */
    name?: string;
    /** Whether user registered as designer */
    isDesigner: boolean;
    /** Designer ID if registered as designer */
    designerId?: string;
  };
  /** Email verification status */
  verification: {
    /** Whether email verification is required */
    required: boolean;
    /** Whether verification email was sent */
    emailSent: boolean;
    /** Expiration time for verification token */
    expiresAt?: number;
  };
  /** Initial session information */
  session?: {
    /** JWT access token */
    accessToken: string;
    /** Token expiration timestamp */
    expiresAt: number;
  };
}

/**
 * Registration failure response
 * Returned when registration fails
 *
 * @example
 * ```typescript
 * const registerError: RegisterErrorDto = {
 *   code: "EMAIL_TAKEN",
 *   message: "Email already registered",
 *   field: "email"
 * };
 * ```
 */
export interface RegisterErrorDto {
  /** Error code for client-side handling */
  code: AuthErrorCode;
  /** Human-readable error message */
  message: string;
  /** Field that caused the error */
  field?: string;
  /** Validation details if applicable */
  validation?: {
    /** Field specific error details */
    [field: string]: {
      /** Error message for the field */
      message: string;
      /** Validation rule that failed */
      rule: string;
    };
  };
}

/**
 * Email verification request
 * Used when verifying email after registration
 */
export interface EmailVerificationRequestDto {
  /** Verification token from email */
  token: string;
}

/**
 * Email verification response
 * Returned after email verification attempt
 */
export interface EmailVerificationResponseDto {
  /** Whether verification was successful */
  success: boolean;
  /** User's email address */
  email: string;
  /** When verification was completed */
  verifiedAt: number;
  /** Post-verification session token */
  session?: {
    accessToken: string;
    expiresAt: number;
  };
}
