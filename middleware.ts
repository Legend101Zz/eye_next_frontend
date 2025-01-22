import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userID = request.cookies.get("userID")?.value;
  const isDesigner = request.cookies.get("isDesigner")?.value;

  // Protected routes configuration
  const protectedRoutes = ["/cart", "/profile"];

  const designerRoutes = ["/editor", "/profile/DesignerDashboard"];

  const currentPath = request.nextUrl.pathname;

  // Check if the current path is protected
  if (protectedRoutes.includes(currentPath)) {
    if (!userID) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Check if the current path is designer-only
  if (designerRoutes.includes(currentPath)) {
    if (!userID) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (!isDesigner) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/cart", "/profile/:path*", "/editor/:path*"],
};
