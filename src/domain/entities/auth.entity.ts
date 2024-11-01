export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = "Invalid email or password") {
    super("INVALID_CREDENTIALS", message);
  }
}

export class EmailAlreadyExistsError extends AuthError {
  constructor(message = "Email already exists") {
    super("EMAIL_EXISTS", message);
  }
}

// src/domain/auth/auth.types.ts
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isDesigner: boolean;
  designerId?: string;
  image?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface GoogleProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
}
