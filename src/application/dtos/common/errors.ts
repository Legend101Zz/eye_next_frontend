/**
 * Common Error Types and Codes
 * Centralizes error handling across the application
 *
 * @module common/errors
 */

/**
 * Authentication Error Codes
 * Possible error codes for authentication-related operations
 */
export enum AuthErrorCode {
  // Credential Errors
  INVALID_CREDENTIALS = "invalid_credentials",
  INVALID_EMAIL = "invalid_email",
  INVALID_PASSWORD = "invalid_password",
  WEAK_PASSWORD = "weak_password",
  PASSWORD_MISMATCH = "password_mismatch",

  // Account Status Errors
  ACCOUNT_DISABLED = "account_disabled",
  ACCOUNT_LOCKED = "account_locked",
  ACCOUNT_NOT_FOUND = "account_not_found",
  ACCOUNT_NOT_VERIFIED = "account_not_verified",
  ACCOUNT_DELETED = "account_deleted",

  // Email Verification
  EMAIL_NOT_VERIFIED = "email_not_verified",
  EMAIL_ALREADY_VERIFIED = "email_already_verified",
  EMAIL_IN_USE = "email_in_use",
  INVALID_VERIFICATION_TOKEN = "invalid_verification_token",
  VERIFICATION_TOKEN_EXPIRED = "verification_token_expired",

  // Session Errors
  INVALID_TOKEN = "invalid_token",
  TOKEN_EXPIRED = "token_expired",
  SESSION_EXPIRED = "session_expired",
  INVALID_REFRESH_TOKEN = "invalid_refresh_token",
  REFRESH_TOKEN_EXPIRED = "refresh_token_expired",

  // OAuth Errors
  OAUTH_ERROR = "oauth_error",
  GOOGLE_AUTH_FAILED = "google_auth_failed",
  FACEBOOK_AUTH_FAILED = "facebook_auth_failed",
  OAUTH_ACCOUNT_EXISTS = "oauth_account_exists",
  OAUTH_EMAIL_IN_USE = "oauth_email_in_use",

  // Password Reset
  PASSWORD_RESET_FAILED = "password_reset_failed",
  PASSWORD_RESET_TOKEN_INVALID = "password_reset_token_invalid",
  PASSWORD_RESET_TOKEN_EXPIRED = "password_reset_token_expired",
  PASSWORD_RECENTLY_USED = "password_recently_used",

  // Rate Limiting
  TOO_MANY_REQUESTS = "too_many_requests",
  TOO_MANY_ATTEMPTS = "too_many_attempts",
  IP_BLOCKED = "ip_blocked",

  // Permission Errors
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  INSUFFICIENT_PERMISSIONS = "insufficient_permissions",
  ROLE_REQUIRED = "role_required",

  // Device/Location Errors
  UNKNOWN_DEVICE = "unknown_device",
  SUSPICIOUS_LOCATION = "suspicious_location",
  LOCATION_NOT_ALLOWED = "location_not_allowed",
  DEVICE_NOT_VERIFIED = "device_not_verified",

  // Multi-Factor Authentication
  MFA_REQUIRED = "mfa_required",
  MFA_INVALID_CODE = "mfa_invalid_code",
  MFA_CODE_EXPIRED = "mfa_code_expired",
  MFA_SETUP_REQUIRED = "mfa_setup_required",

  // Generic Errors
  INTERNAL_ERROR = "internal_error",
  SERVICE_UNAVAILABLE = "service_unavailable",
  INVALID_REQUEST = "invalid_request",
  VALIDATION_ERROR = "validation_error",
}

/**
 * Base Error class for application errors
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: any,
    public httpStatus: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Authentication Error class
 */
export class AuthError extends AppError {
  constructor(
    public code: AuthErrorCode,
    message: string,
    details?: any,
    httpStatus: number = 401,
  ) {
    super(code, message, details, httpStatus);
    this.name = "AuthError";
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public validationErrors: Record<string, string[]>,
    httpStatus: number = 400,
  ) {
    super("validation_error", message, validationErrors, httpStatus);
    this.name = "ValidationError";
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string, httpStatus: number = 404) {
    super(
      "not_found",
      `${resource} not found with identifier: ${identifier}`,
      { resource, identifier },
      httpStatus,
    );
    this.name = "NotFoundError";
  }
}

/**
 * Domain Error class for business logic errors
 */
export class DomainError extends AppError {
  constructor(
    code: string,
    message: string,
    details?: any,
    httpStatus: number = 422,
  ) {
    super(code, message, details, httpStatus);
    this.name = "DomainError";
  }
}

/**
 * Error factory for creating consistent error responses
 */
export class ErrorFactory {
  /**
   * Create an authentication error
   */
  static authError(
    code: AuthErrorCode,
    message?: string,
    details?: any,
  ): AuthError {
    return new AuthError(
      code,
      message || this.getDefaultMessage(code),
      details,
    );
  }

  /**
   * Create a validation error
   */
  static validationError(errors: Record<string, string[]>): ValidationError {
    const message = "Validation failed";
    return new ValidationError(message, errors);
  }

  /**
   * Create a not found error
   */
  static notFound(resource: string, identifier: string): NotFoundError {
    return new NotFoundError(resource, identifier);
  }

  /**
   * Create a domain error
   */
  static domainError(
    code: string,
    message: string,
    details?: any,
  ): DomainError {
    return new DomainError(code, message, details);
  }

  /**
   * Get default message for auth error code
   */
  private static getDefaultMessage(code: AuthErrorCode): string {
    const messages: Record<AuthErrorCode, string> = {
      [AuthErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
      [AuthErrorCode.ACCOUNT_DISABLED]: "Account has been disabled",
      [AuthErrorCode.EMAIL_NOT_VERIFIED]: "Email address not verified",
      [AuthErrorCode.TOKEN_EXPIRED]: "Authentication token has expired",
      // Add more default messages as needed
      [AuthErrorCode.INVALID_TOKEN]: "Invalid authentication token",
      [AuthErrorCode.SESSION_EXPIRED]: "Your session has expired",
      [AuthErrorCode.UNAUTHORIZED]: "Unauthorized access",
      [AuthErrorCode.FORBIDDEN]: "Access forbidden",
      // ... add messages for all other error codes
    } as const;

    return messages[code] || "An authentication error occurred";
  }
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Error details */
  details?: any;
  /** Validation errors */
  validationErrors?: Record<string, string[]>;
  /** Request ID for tracking */
  requestId?: string;
  /** Timestamp */
  timestamp: number;
}

/**
 * Create error response object
 */
export function createErrorResponse(error: AppError): ErrorResponse {
  return {
    code: error.code,
    message: error.message,
    details: error.details,
    validationErrors:
      error instanceof ValidationError ? error.validationErrors : undefined,
    timestamp: Date.now(),
  };
}
