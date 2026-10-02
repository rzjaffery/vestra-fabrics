// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/staff")

    // Update this line to include /admin/auth paths
    const isLoginPage =
        pathname.startsWith("/admin/auth") ||
        pathname.startsWith("/staff/auth") ||
        pathname === "/admin/login"

    // Check for auth cookie/token
    const token = req.cookies.get("admin_token")?.value || req.cookies.get("next-auth.session-token")?.value

    // Redirect unauthenticated users to the correct login path
    if (isAdminRoute && !isLoginPage && !token) {
        const loginUrl = new URL("/admin/auth/login", req.url)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from login pages
    if (isLoginPage && token) {
        const dashboardUrl = new URL("/admin", req.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/staff/:path*"],
}