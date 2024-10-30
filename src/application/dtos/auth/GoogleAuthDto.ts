/**
 * Google Authentication Data Transfer Objects (DTOs)
 * These DTOs handle Google OAuth authentication data transformations
 * between the presentation layer and domain layer.
 *
 * @module auth/dtos
 */

import { AuthErrorCode } from "../common/errors";

/**
 * Google OAuth request payload
 * Used when authenticating with Google OAuth
 *
 * @example
 * ```typescript
 * const googleRequest: GoogleAuthRequestDto = {
 *   token: "google-oauth-token",
 *   profile: {
 *     id: "google-id",
 *     email: "artist@gmail.com",
 *     name: "John Artist"
 *   }
 * };
 * ```
 */
export interface GoogleAuthRequestDto {
  /** Google OAuth token */
  token: string;
  /** Google user profile information */
  profile: {
    /** Google's unique user ID */
    id: string;
    /** User's email address */
    email: string;
    /** User's full name from Google */
    name?: string;
    /** URL to user's Google profile picture */
    picture?: string;
    /** Whether email is verified by Google */
    emailVerified?: boolean;
    /** User's locale setting */
    locale?: string;
  };
  /** Additional authentication options */
  options?: {
    /** Whether to link to existing account */
    linkToExisting?: boolean;
    /** Whether to register as designer */
    registerAsDesigner?: boolean;
    /** Initial designer profile if registering as designer */
    designerProfile?: {
      artistName: string;
      description?: string;
    };
  };
}

/**
 * Google OAuth response
 * Returned after successful Google authentication
 *
 * @example
 * ```typescript
 * const googleResponse: GoogleAuthResponseDto = {
 *   user: {
 *     id: "user123",
 *     email: "artist@gmail.com",
 *     isNewUser: true
 *   },
 *   session: {
 *     accessToken: "jwt-token"
 *   }
 * };
 * ```
 */
export interface GoogleAuthResponseDto {
  /** User information */
  user: {
    /** User's unique identifier in our system */
    id: string;
    /** User's email address */
    email: string;
    /** User's display name */
    name?: string;
    /** Whether this is a new user registration */
    isNewUser: boolean;
    /** Whether user is a designer */
    isDesigner: boolean;
    /** Designer ID if applicable */
    designerId?: string;
    /** Profile picture URL */
    profileImageUrl?: string;
  };
  /** Session information */
  session: {
    /** JWT access token */
    accessToken: string;
    /** Refresh token */
    refreshToken?: string;
    /** Token expiration timestamp */
    expiresAt: number;
  };
  /** Account linking information if applicable */
  linking?: {
    /** Whether accounts were linked */
    linked: boolean;
    /** Previous account ID if linked */
    previousAccountId?: string;
  };
}

/**
 * Google auth failure response
 * Returned when Google authentication fails
 *
 * @example
 * ```typescript
 * const googleError: GoogleAuthErrorDto = {
 *   code: "INVALID_TOKEN",
 *   message: "Invalid or expired Google token"
 * };
 * ```
 */
export interface GoogleAuthErrorDto {
  /** Error code for client-side handling */
  code: AuthErrorCode;
  /** Human-readable error message */
  message: string;
  /** Additional error context */
  details?: {
    /** Whether error is recoverable */
    recoverable: boolean;
    /** Suggested action for recovery */
    suggestion?: string;
    /** Technical error details */
    technical?: string;
  };
}

/**
 * Google account linking request
 * Used when linking Google account to existing account
 */
export interface GoogleLinkRequestDto {
  /** Google OAuth token */
  googleToken: string;
  /** Existing account credentials */
  existingAccount: {
    /** Account email */
    email: string;
    /** Account password */
    password: string;
  };
}

/**
 * Google account linking response
 * Returned after account linking attempt
 */
export interface GoogleLinkResponseDto {
  /** Whether linking was successful */
  success: boolean;
  /** Updated user information */
  user?: {
    id: string;
    email: string;
    linkedProviders: string[];
  };
}
