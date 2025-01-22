import { signOut as nextAuthSignOut } from "next-auth/react";

export const handleLogout = async () => {
  try {
    // Clear sessionStorage
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("idDesigner");

    // Call your backend logout API if needed
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    });

    // Sign out from NextAuth
    await nextAuthSignOut({ redirect: true, callbackUrl: "/auth/login" });
  } catch (error) {
    console.error("Logout error:", error);
    // Even if API call fails, clear local storage and sign out from NextAuth
    sessionStorage.clear();
    await nextAuthSignOut({ redirect: true, callbackUrl: "/auth/login" });
  }
};
