import { Collection } from "mongodb";
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getSession, signIn, signOut } from "next-auth/react";
import { z } from "zod";
import { IAuthService } from "@/domain/ports/repositories/IAuthRepository";
import {
  AuthUser,
  UserCredentials,
  GoogleProfile,
  AuthToken,
} from "@/domain/entities/auth.entity";
import clientPromise from "@/lib/db";

/**
 * Validation schemas for authentication
 */
const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Auth Service Implementation using Next-Auth
 */
export class AuthService implements IAuthService {
  constructor(private readonly usersCollection: Collection) {}

  /**
   * Sign up a new user with email and password
   *
   * @param credentials - User credentials
   * @returns Promise resolving to authenticated user
   * @throws {ValidationError} If credentials are invalid
   * @throws {DuplicateEmailError} If email already exists
   */
  async signUp(credentials: UserCredentials): Promise<AuthUser> {
    try {
      // Validate credentials
      const validCredentials = credentialsSchema.parse(credentials);

      // Check if user exists
      const existingUser = await this.usersCollection.findOne({
        email: validCredentials.email,
      });

      if (existingUser) {
        throw new Error("Email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validCredentials.password, 10);

      // Create user
      const result = await this.usersCollection.insertOne({
        email: validCredentials.email,
        password: hashedPassword,
        isDesigner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Auto sign in after signup
      await signIn("credentials", {
        email: validCredentials.email,
        password: validCredentials.password,
        redirect: false,
      });

      // Return AuthUser object
      return {
        id: result.insertedId.toString(),
        email: validCredentials.email,
        isDesigner: false,
      };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  /**
   * Log in with email and password
   *
   * @param credentials - User credentials
   * @returns Promise resolving to authenticated user
   * @throws {AuthenticationError} If credentials are incorrect
   */
  async login(credentials: UserCredentials): Promise<AuthUser> {
    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      const session = await getSession();
      if (!session?.user) {
        throw new Error("Login failed");
      }

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        isDesigner: session.user.isDesigner,
        designerId: session.user.designerId,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Authenticate with Google
   *
   * @param profile - Google profile data
   * @returns Promise resolving to authenticated user
   */
  async googleAuth(profile: GoogleProfile): Promise<AuthUser> {
    try {
      // Find or create user
      const result = await this.usersCollection.findOneAndUpdate(
        { email: profile.email },
        {
          $set: {
            googleId: profile.id,
            name: profile.name,
            picture: profile.picture,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            isDesigner: false,
            createdAt: new Date(),
          },
        },
        { upsert: true, returnDocument: "after" },
      );

      const user = result.value;
      if (!user) {
        throw new Error("Failed to create/update user");
      }

      // Sign in with Google
      await signIn("google", { redirect: false });

      return {
        id: user._id.toString(),
        email: profile.email,
        name: profile.name,
        isDesigner: user.isDesigner || false,
        designerId: user.designerId?.toString(),
      };
    } catch (error) {
      console.error("Google auth error:", error);
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   *
   * @returns Promise resolving to current user or null
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const session = await getSession();
      if (!session?.user) {
        return null;
      }

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        isDesigner: session.user.isDesigner,
        designerId: session.user.designerId,
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  /**
   * Check if current session is valid
   *
   * @returns Promise resolving to boolean
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await getSession();
      return !!session;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  }
}

/**
 * Next-Auth Session Types
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      isDesigner: boolean;
      designerId?: string;
    };
  }

  interface User {
    isDesigner: boolean;
    designerId?: string;
  }
}

/**
 * Next-Auth Configuration
 */
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          isDesigner: false,
        };
      },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Validate credentials format
        const validCredentials = credentialsSchema.parse(credentials);

        const db = (await clientPromise).db();
        const user = await db.collection("users").findOne({
          email: validCredentials.email,
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          validCredentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isDesigner: user.isDesigner || false,
          designerId: user.designerId?.toString(),
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.isDesigner = token.isDesigner as boolean;
        session.user.designerId = token.designerId as string | undefined;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.isDesigner = user.isDesigner;
        token.designerId = user.designerId;
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },
};
