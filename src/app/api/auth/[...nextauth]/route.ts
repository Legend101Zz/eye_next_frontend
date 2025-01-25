//@ts-nocheck
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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
        // Call your backend API to handle Google authentication
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/google-auth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            },
            body: JSON.stringify({
              email: profile.email,
              username:
                profile.name?.replace(/\s+/g, "").toLowerCase() ||
                profile.email.split("@")[0],
              name: profile.name,
              googleId: profile.sub,
              image: profile.picture,
            }),
          }
        );

        const data = await response.json();

        console.log("got_signedin", data);

        // Store user data in sessionStorage to match your existing auth flow
        if (typeof window !== "undefined" && data.userId) {
          sessionStorage.setItem("userID", data.userId);
          if (data.isDesigner) {
            sessionStorage.setItem("idDesigner", data.designerId);
          }
        }

        return true;
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.googleId = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      // Keep session minimal since we're using sessionStorage
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST };
