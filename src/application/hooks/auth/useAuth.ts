import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { AuthService } from "@/infrastructure/services/auth.service";
import { UserCredentials } from "@/domain/entities/auth.entity";

/**
 * ### Login Flow (Standard and Google OAuth)
 *
 * #### Standard Login Flow:
 * 1. The component calls `useAuth().login()`.
 * 2. `useAuth` invokes `AuthService.login()` to handle validation and business logic.
 * 3. If the validation is successful, `useAuth` calls `NextAuth`'s `signIn()` method.
 * 4. `NextAuth` creates a session based on the configuration in `authOptions`.
 * 5. `NextAuth` maintains the session state, accessible through `useAuth`.
 *
 * #### Google OAuth Login Flow:
 * 1. The component calls `useAuth().googleLogin()`.
 * 2. `useAuth` invokes `NextAuth`'s `signIn("google")` to initiate Google OAuth login.
 * 3. `NextAuth` manages the OAuth process using the `authOptions` configuration.
 * 4. On successful authentication, `authOptions` callbacks sync user data with the database.
 * 5. `NextAuth` creates and maintains a session, accessible through `useAuth`.
 */

// Create a singleton instance of AuthService
const authService = new AuthService();

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign up new user
  const signUp = useCallback(
    async (credentials: UserCredentials) => {
      try {
        setLoading(true);
        setError(null);

        // Use AuthService to create the account
        const user = await authService.signUp(credentials);

        // After successful signup, log them in using Next-Auth
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push("/");
        return user;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to sign up";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // Log in with credentials
  const login = useCallback(
    async (credentials: UserCredentials) => {
      try {
        setLoading(true);
        setError(null);

        // Use AuthService for validation and business logic
        await authService.login(credentials);

        // Use Next-Auth for session management
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push("/");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to login";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // Google OAuth login
  const googleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use Next-Auth for Google OAuth
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to login with Google";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use AuthService for cleanup if needed
      await authService.logout();

      // Use Next-Auth for session cleanup
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to logout";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading" || loading,
    error,
    signUp,
    login,
    googleLogin,
    logout,
  };
};
