import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { user as UserModel } from "@/lib/user.model";
import clientPromise from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
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
          throw new Error("Missing credentials");
        }

        const user = await UserModel.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isDesigner: user.isDesigner,
          designerId: user.DesignerId?.toString(),
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.isDesigner = user.isDesigner;
        token.designerId = user.designerId;
      }

      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.isDesigner = token.isDesigner as boolean;
        session.user.designerId = token.designerId as string | undefined;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Sync Google user data with our DB
        await UserModel.findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              googleId: profile?.sub,
              email: user.email,
              name: user.name,
              image: user.image,
            },
            $setOnInsert: {
              isDesigner: false,
            },
          },
          { upsert: true },
        );
      }
      return true;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/signup",
  },
};
