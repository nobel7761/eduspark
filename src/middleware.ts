import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register";

  // Get the token from cookies
  const token = request.cookies.get("accessToken")?.value;

  // Debug logs
  console.log("Middleware - Path:", path);
  console.log("Middleware - Token exists:", !!token);
  console.log("Middleware - Is public path:", isPublicPath);

  // If trying to access a public path while logged in
  if (isPublicPath && token) {
    console.log("Middleware - Redirecting to home (public path with token)");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If trying to access a protected path while logged out
  if (!isPublicPath && !token) {
    console.log(
      "Middleware - Redirecting to login (protected path without token)"
    );
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clear any existing tokens
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // For protected paths with a valid token
  if (!isPublicPath && token) {
    console.log("Middleware - Adding token to headers");
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  console.log("Middleware - Allowing request");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
