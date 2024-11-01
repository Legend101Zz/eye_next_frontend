import {
  AuthUser,
  UserCredentials,
  GoogleProfile,
  AuthToken,
} from "@/domain/entities/auth.entity";

/**
 * Authentication Service Interface
 */
export interface IAuthService {
  /**
   * Sign up a new user with email and password
   *
   * @param credentials - User's email and password
   * @returns Promise resolving to authenticated user
   * @throws {ValidationError} If credentials are invalid
   * @throws {DuplicateEmailError} If email already exists
   */
  signUp(credentials: UserCredentials): Promise<AuthUser>;

  /**
   * Log in with email and password
   *
   * @param credentials - User's email and password
   * @returns Promise resolving to authenticated user
   * @throws {ValidationError} If credentials are invalid
   * @throws {AuthenticationError} If credentials are incorrect
   */
  login(credentials: UserCredentials): Promise<AuthUser>;

  /**
   * Authenticate with Google
   *
   * @param profile - Google profile data
   * @returns Promise resolving to authenticated user
   */
  googleAuth(profile: GoogleProfile): Promise<void>;

  /**
   * Log out the current user
   *
   * @returns Promise resolving when logout is complete
   */
  logout(): Promise<void>;

  /**
   * Get the current authenticated user
   *
   * @returns Promise resolving to current user or null
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Check if current session is valid
   *
   * @returns Promise resolving to boolean
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Refresh the authentication token
   *
   * @returns Promise resolving to new auth token
   * @throws {AuthenticationError} If refresh token is invalid
   */
  refreshToken(): Promise<AuthToken>;
}
