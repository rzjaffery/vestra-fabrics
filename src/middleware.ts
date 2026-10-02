// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/staff")

    const isLoginPage =
        pathname.startsWith("/admin/auth") ||
        pathname.startsWith("/staff/auth") ||
        pathname === "/admin/login"

    // Check for 'admin_authenticated' cookie set by your login form
    const token =
        req.cookies.get("admin_authenticated")?.value ||
        req.cookies.get("admin_token")?.value ||
        req.cookies.get("next-auth.session-token")?.value

    // 1. Redirect unauthenticated users to login
    if (isAdminRoute && !isLoginPage && !token) {
        const loginUrl = new URL("/admin/auth/login", req.url)
        return NextResponse.redirect(loginUrl)
    }

    // 2. Redirect authenticated users away from login page to dashboard
    if (isLoginPage && token) {
        const dashboardUrl = new URL("/admin", req.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/staff/:path*"],
}