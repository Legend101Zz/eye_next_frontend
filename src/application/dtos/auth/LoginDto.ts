/**
 * Login-related Data Transfer Objects (DTOs)
 * These DTOs handle the login process data transformations between
 * the presentation layer and domain layer.
 *
 * @module auth/dtos
 */

import { AuthErrorCode } from "../common/errors";

/**
 * Login request payload
 * Used when user attempts to authenticate with email/password
 *
 * @example
 * ```typescript
 * const loginRequest: LoginRequestDto = {
 *   email: "artist@deauth.com",
 *   password: "secure123",
 *   rememberMe: true
 * };
 * ```
 */
export interface LoginRequestDto {
  /** User's email address */
  email: string;
  /** User's password (will be hashed in auth service) */
  password: string;
  /** Optional flag for extending session duration */
  rememberMe?: boolean;
  /** Optional device info for multi-device tracking */
  deviceInfo?: {
    /** Device/browser name */
    userAgent: string;
    /** Device/browser language */
    language: string;
    /** Device platform (web, mobile, etc.) */
    platform: string;
  };
}

/**
 * Successful login response
 * Returned after successful authentication
 * Contains user session information and access tokens
 *
 * @example
 * ```typescript
 * const loginResponse: LoginResponseDto = {
 *   user: {
 *     id: "user123",
 *     email: "artist@deauth.com",
 *     isDesigner: true
 *   },
 *   session: {
 *     accessToken: "jwt-token",
 *     expiresAt: 1234567890
 *   }
 * };
 * ```
 */
export interface LoginResponseDto {
  /** Authenticated user information */
  user: {
    /** User's unique identifier */
    id: string;
    /** User's email address */
    email: string;
    /** User's display name */
    name?: string;
    /** Indicates if user has designer privileges */
    isDesigner: boolean;
    /** Designer ID if user is a designer */
    designerId?: string;
    /** URL to user's profile picture */
    profileImageUrl?: string;
    /** Last login timestamp */
    lastLoginAt: number;
  };
  /** Session information */
  session: {
    /** JWT access token */
    accessToken: string;
    /** Refresh token for obtaining new access tokens */
    refreshToken?: string;
    /** Token expiration timestamp */
    expiresAt: number;
    /** Session ID for tracking/revocation */
    sessionId: string;
  };
}

/**
 * Login failure response
 * Returned when login attempt fails
 * Provides structured error information
 *
 * @example
 * ```typescript
 * const loginError: LoginErrorDto = {
 *   code: "INVALID_CREDENTIALS",
 *   message: "Invalid email or password",
 *   attempts: 2,
 *   remainingAttempts: 3
 * };
 * ```
 */
export interface LoginErrorDto {
  /** Error code for client-side handling */
  code: AuthErrorCode;
  /** Human-readable error message */
  message: string;
  /** Number of failed attempts */
  attempts?: number;
  /** Remaining login attempts before lockout */
  remainingAttempts?: number;
  /** Account lockout duration in seconds */
  lockoutDuration?: number;
  /** Timestamp when account will be unlocked */
  unlockAt?: number;
}
