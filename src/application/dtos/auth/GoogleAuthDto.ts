/**
 * Data Transfer Object for Google authentication
 * Maps Google OAuth profile to our system
 * Used by AuthService.googleAuth() and GoogleAuthUseCase
 *
 * @example
 * ```typescript
 * const googleAuthDto: GoogleAuthDto = {
 *   token: "google-oauth-token",
 *   profile: {
 *     id: "google-id",
 *     email: "user@gmail.com",
 *     name: "John Doe",
 *     picture: "profile-url"
 *   }
 * };
 * ```
 */
export interface GoogleAuthDto {
  /** Google OAuth token */
  token: string;

  /** Google user profile information */
  profile: {
    /** Google user ID */
    id: string;
    /** User's email address */
    email: string;
    /** User's full name */
    name?: string;
    /** Profile picture URL */
    picture?: string;
    /** Email verification status */
    emailVerified?: boolean;
    /** Locale setting */
    locale?: string;
  };

  /** Additional scopes granted */
  grantedScopes?: string[];
}
