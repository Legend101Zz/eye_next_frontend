/**
 * Data Transfer Object for user registration
 * Extends domain UserCredentials with additional registration fields
 * Used by AuthService.signUp() and RegisterUseCase
 *
 * @example
 * ```typescript
 * const registerDto: RegisterDto = {
 *   email: "user@example.com",
 *   password: "password123",
 *   confirmPassword: "password123",
 *   name: "John Doe",
 *   acceptTerms: true
 * };
 * ```
 */
export interface RegisterDto {
  /** User's email address */
  email: string;

  /** User's chosen password */
  password: string;

  /** Password confirmation */
  confirmPassword: string;

  /** User's full name */
  name?: string;

  /** User's acceptance of terms and conditions */
  acceptTerms: boolean;

  /** Whether user wants to register as a designer */
  isDesigner?: boolean;

  /** Optional newsletter subscription */
  newsletter?: boolean;

  /** Reference code if invited by another user */
  referralCode?: string;
}
