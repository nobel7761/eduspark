import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register";

  // Get the token from localStorage (stored in cookies for SSR compatibility)
  const token = request.cookies.get("accessToken")?.value || "";

  // If trying to access a public path while logged in
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If trying to access a protected path while logged out
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
