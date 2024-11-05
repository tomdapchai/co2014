// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* export function middleware(request: NextRequest) {
    // Check if the request is for the root URL
    if (request.nextUrl.pathname === "/") {
        const dashboardUrl = new URL("/dashboard", request.url); // Redirect URL
        return NextResponse.redirect(dashboardUrl); // Redirect to /dashboard
    }

    // Allow the request to continue if it's not for the root URL
    return NextResponse.next();
}

// Define which routes the middleware should apply to
export const config = {
    matcher: "/", // Only match the root URL
}; */

export default function middleware(req: NextRequest) {}
