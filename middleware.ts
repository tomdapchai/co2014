import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth-related public routes
const authRoutes = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAuthenticated = !!request.cookies.get("auth_user_id");

    // User is authenticated and trying to access auth routes
    if (isAuthenticated && authRoutes.includes(pathname)) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // User is NOT authenticated and trying to access any path other than auth routes
    if (
        !isAuthenticated &&
        !authRoutes.includes(pathname) &&
        pathname !== "/"
    ) {
        // Store the attempted URL to redirect back after login
        const signInUrl = new URL("/sign-in", request.url);
        if (pathname !== "/") {
            signInUrl.searchParams.set("callbackUrl", pathname);
        }
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
    ],
};
