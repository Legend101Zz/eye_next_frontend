/**
 * Data Transfer Object for user login requests
 * Maps to UserCredentials in domain layer
 * Used by AuthService.login() and LoginUseCase
 *
 * @example
 * ```typescript
 * const loginDto: LoginDto = {
 *   email: "user@example.com",
 *   password: "password123",
 *   rememberMe: true
 * };
 * ```
 */
export interface LoginDto {
  /** User's email address */
  email: string;

  /** User's password */
  password: string;

  /** Whether to enable persistent session */
  rememberMe?: boolean;

  /** Device information for security tracking */
  deviceInfo?: {
    /** Device type (mobile/desktop/tablet) */
    deviceType: string;
    /** Browser information */
    userAgent: string;
    /** IP address */
    ipAddress?: string;
  };
}
