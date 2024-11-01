/**
 * Signup Hook
 * @module application/hooks/auth/useSignup
 *
 * @description
 * Hook for handling user registration using proper DTOs and domain entities.
 * Supports both regular user and designer registration flows.
 *
 * Dependencies:
 * - RegisterDto, RegisterResponseDto from application layer
 * - AuthService from infrastructure layer
 * - AuthError, ValidationError from domain layer
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IAuthService } from "@/domain/ports/repositories/IAuthRepository";
import {
  RegisterRequestDto,
  RegisterResponseDto,
} from "@/application/dtos/auth/RegisterDto";
import { AuthError, ValidationError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";

export interface UseSignupReturn {
  /** Signup function accepting registration data */
  signup: (data: RegisterRequestDto) => Promise<boolean>;
  /** Loading state during registration */
  isLoading: boolean;
  /** Any registration or validation errors */
  error: AuthError | ValidationError | null;
  /** Reset error state */
  resetError: () => void;
}

/**
 * Hook for handling user registration
 *
 * @param authService - Instance of IAuthService
 * @returns Signup functionality and state
 *
 * @example
 * ```tsx
 * const SignupForm = () => {
 *   const { signup, isLoading, error } = useSignup(authService);
 *
 *   const handleSubmit = async (data: RegisterDto) => {
 *     const success = await signup(data);
 *     if (success) {
 *       // Handle successful registration
 *     }
 *   };
 * };
 * ```
 */
export const useSignup = (authService: IAuthService): UseSignupReturn => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | ValidationError | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const signup = useCallback(
    async (data: RegisterRequestDto): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate registration data
        if (!data.email || !data.password) {
          throw new ValidationError("Invalid registration data", {
            email: data.email ? [] : ["Email is required"],
            password: data.password ? [] : ["Password is required"],
          });
        }

        // Map DTO to domain model and perform registration
        const response = await authService.signUp({
          email: data.email,
          password: data.password,
          name: data.name,
          isDesigner: data.isDesigner,
          designerProfile: data.designerProfile,
        });

        // Show success message
        toast({
          title: "Welcome to Deauth!",
          description: data.isDesigner
            ? "Your designer account has been created successfully"
            : "Your account has been created successfully",
        });

        // Handle email verification if required
        if (response.verification.required) {
          router.push("/auth/verify-email");
          toast({
            title: "Verify Your Email",
            description: "Please check your email to verify your account",
          });
        } else {
          // Navigate based on user type
          router.push(data.isDesigner ? "/designer/onboarding" : "/onboarding");
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
          if (err.code === "EMAIL_IN_USE") {
            toast({
              title: "Email Already Registered",
              description: "Please try logging in instead",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Registration Failed",
              description: err.message,
              variant: "destructive",
            });
          }
        } else {
          const error = new AuthError(
            "SIGNUP_ERROR",
            "An unexpected error occurred during registration",
          );
          setError(error);
          toast({
            title: "Registration Error",
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
    signup,
    isLoading,
    error,
    resetError,
  };
};
