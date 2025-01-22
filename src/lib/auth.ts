import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false;

      try {
        // Call your API to handle Google sign in/up
        const response = await fetch(`${process.env.API_URL}/api/user/google-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.API_KEY!,
          },
          body: JSON.stringify({
            email: profile.email,
            name: profile.name,
            username: profile.name?.replace(/\s+/g, '').toLowerCase() || profile.email.split('@')[0],
            googleId: profile.sub,
          }),
        });

        if (!response.ok) return false;
        return true;
      } catch (error) {
        console.error("Error in Google auth:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
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