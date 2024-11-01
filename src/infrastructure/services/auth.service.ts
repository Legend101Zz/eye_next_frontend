import { Session } from "next-auth";
import { signIn, signOut, getSession } from "next-auth/react";
import { IAuthService } from "@/domain/ports/repositories/IAuthRepository";
import {
  AuthUser,
  UserCredentials,
  GoogleProfile,
  InvalidCredentialsError,
  EmailAlreadyExistsError,
} from "@/domain/entities/auth.entity";
import bcrypt from "bcryptjs";
import { user as UserModel } from "@/lib/user.model";

export class AuthService implements Partial<IAuthService> {
  async signUp(credentials: UserCredentials): Promise<AuthUser> {
    try {
      // Check if user exists
      const existingUser = await UserModel.findOne({
        email: credentials.email,
      });
      if (existingUser) {
        throw new EmailAlreadyExistsError();
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(credentials.password, 10);

      // Create user
      const user = await UserModel.create({
        email: credentials.email,
        password: hashedPassword,
        isDesigner: false,
      });

      // Auto sign in
      await this.login(credentials);

      return {
        id: user._id.toString(),
        email: user.email,
        isDesigner: false,
      };
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw error;
      }
      throw new Error("Failed to create account");
    }
  }

  async login(credentials: UserCredentials): Promise<AuthUser> {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new InvalidCredentialsError();
    }

    const session = await getSession();
    if (!session?.user) {
      throw new Error("Failed to get user session");
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      isDesigner: session.user.isDesigner,
      designerId: session.user.designerId,
    };
  }

  async googleAuth(): Promise<void> {
    await signIn("google", { callbackUrl: "/" });
  }

  async logout(): Promise<void> {
    await signOut({ callbackUrl: "/" });
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const session = await getSession();
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      isDesigner: session.user.isDesigner,
      designerId: session.user.designerId,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session;
  }
}
