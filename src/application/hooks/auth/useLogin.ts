/**
 * Login Hook
 * @module application/hooks/auth/useLogin
 *
 * @description
 * Hook for handling user login functionality using proper DTOs and domain entities.
 * Handles the transformation between API requests/responses and domain models.
 *
 * Dependencies:
 * - LoginDto, LoginResponseDto from application layer
 * - AuthService from infrastructure layer
 * - AuthError from domain layer
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IAuthService } from "@/domain/ports/repositories/IAuthRepository";
import {
  LoginRequestDto,
  LoginResponseDto,
} from "@/application/dtos/auth/LoginDto";
import { AuthError, ValidationError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";

export interface UseLoginReturn {
  /** Login function accepting credentials */
  login: (credentials: LoginRequestDto) => Promise<boolean>;
  /** Loading state during login process */
  isLoading: boolean;
  /** Any authentication or validation errors */
  error: AuthError | ValidationError | null;
  /** Reset error state */
  resetError: () => void;
}

/**
 * Hook for handling user login
 *
 * @param authService - Instance of IAuthService
 * @returns Login functionality and state
 *
 * @example
 * ```tsx
 * const LoginForm = () => {
 *   const { login, isLoading, error } = useLogin(authService);
 *
 *   const handleSubmit = async (credentials: LoginDto) => {
 *     const success = await login(credentials);
 *     if (success) {
 *       // Handle successful login
 *     }
 *   };
 * };
 * ```
 */
export const useLogin = (authService: IAuthService): UseLoginReturn => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | ValidationError | null>(null);

  // Reset error state
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Handle login process
  const login = useCallback(
    async (credentials: LoginRequestDto): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate credentials
        if (!credentials.email || !credentials.password) {
          throw new ValidationError("Invalid credentials", {
            email: credentials.email ? [] : ["Email is required"],
            password: credentials.password ? [] : ["Password is required"],
          });
        }

        // Map DTO to domain model and perform login
        const response = await authService.login({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe,
        });

        // Handle successful login
        toast({
          title: "Welcome Back!",
          description: `Successfully logged in as ${response.user.email}`,
        });

        // Navigate based on user type
        if (response.user.isDesigner) {
          router.push("/designer/dashboard");
        } else {
          router.push("/");
        }

        return true;
      } catch (err) {
        // Handle different error types
        if (err instanceof ValidationError) {
          setError(err);
          toast({
            title: "Validation Error",
            description: "Please check your input",
            variant: "destructive",
          });
        } else if (err instanceof AuthError) {
          setError(err);
          toast({
            title: "Authentication Failed",
            description: err.message,
            variant: "destructive",
          });
        } else {
          const error = new AuthError(
            "LOGIN_ERROR",
            "An unexpected error occurred during login",
          );
          setError(error);
          toast({
            title: "Login Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [authService, router],
  );

  return {
    login,
    isLoading,
    error,
    resetError,
  };
};
