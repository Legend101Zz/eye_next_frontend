/**
 * Authentication Hook
 * @module application/hooks/auth/useAuth
 *
 * @description
 * Primary hook for managing authentication state. Integrates with domain and infrastructure layers
 * to provide authentication functionality using proper DTOs and domain entities.
 *
 * Dependencies:
 * - AuthService from infrastructure layer
 * - Auth DTOs from application layer
 * - Auth entities from domain layer
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/domain/entities/auth.entity";
import { IAuthService } from "@/domain/ports/repositories/IAuthRepository";
import { LoginResponseDto } from "@/application/dtos/auth/LoginDto";
import { UserProfileDto } from "@/application/dtos/user/UserProfileDto";
import { toast } from "@/components/ui/use-toast";
import { AuthError } from "@/application/dtos/common/errors";

interface AuthState {
  user: AuthUser | null;
  session: {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
  };
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Hook for managing authentication state
 *
 * @param authService - Instance of IAuthService from infrastructure layer
 * @returns Authentication state and methods
 *
 * @example
 * ```tsx
 * const { user, isLoading, isAuthenticated } = useAuth(authService);
 *
 * if (isLoading) return <Spinner />;
 * if (!isAuthenticated) return <LoginRedirect />;
 * ```
 */
export const useAuth = (authService: IAuthService): UseAuthReturn => {
  const router = useRouter();

  // Initialize auth state with session check
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Update auth state with DTO response
  const updateAuthState = useCallback((response: LoginResponseDto | null) => {
    if (!response) {
      setAuthState({
        user: null,
        session: {
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        },
      });
      return;
    }

    // Map DTO to domain entity and state
    setAuthState({
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        isDesigner: response.user.isDesigner,
        designerId: response.user.designerId,
      },
      session: {
        accessToken: response.session.accessToken,
        refreshToken: response.session.refreshToken || null,
        expiresAt: response.session.expiresAt,
      },
    });
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        updateAuthState(response);
      } catch (err) {
        if (err instanceof AuthError) {
          setError(err);
        } else {
          setError(new AuthError("AUTH_ERROR", "Authentication failed"));
        }
        updateAuthState(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [authService, updateAuthState]);

  // Refresh session handler
  const refreshSession = useCallback(async () => {
    if (!authState.session.refreshToken) return;

    try {
      setIsLoading(true);
      const response = await authService.refreshToken();
      updateAuthState(response);
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err
          : new AuthError("REFRESH_ERROR", "Session refresh failed"),
      );
      // If refresh fails, logout
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [authState.session.refreshToken, authService]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      updateAuthState(null);
      router.push("/auth/login");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err
          : new AuthError("LOGOUT_ERROR", "Logout failed"),
      );
      toast({
        title: "Logout Error",
        description: "Failed to logout properly",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [authService, router]);

  // Auto refresh token before expiry
  useEffect(() => {
    const expiresAt = authState.session.expiresAt;
    if (!expiresAt) return;

    const timeUntilExpiry = expiresAt - Date.now();
    const refreshBuffer = 5 * 60 * 1000; // 5 minutes

    if (timeUntilExpiry < refreshBuffer) {
      refreshSession();
    }

    const refreshTimer = setTimeout(
      refreshSession,
      timeUntilExpiry - refreshBuffer,
    );
    return () => clearTimeout(refreshTimer);
  }, [authState.session.expiresAt, refreshSession]);

  return {
    user: authState.user,
    isLoading,
    error,
    isAuthenticated: !!authState.user,
    logout,
    refreshSession,
  };
};
