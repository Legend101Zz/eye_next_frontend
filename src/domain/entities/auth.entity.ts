/**
 * Authentication types and interfaces
 */

export interface UserCredentials {
  email: string;
  password: string;
}

export interface GoogleProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isDesigner: boolean;
  designerId?: string;
}
