// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Define protected paths
    const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/staff")
    const isLoginPage = pathname === "/admin/login" || pathname === "/staff/login"

    // Check for your auth token or cookie (adjust key name to match your auth system)
    const token = req.cookies.get("admin_token")?.value || req.cookies.get("next-auth.session-token")?.value

    // 1. Redirect unauthenticated users trying to access protected admin pages
    if (isAdminRoute && !isLoginPage && !token) {
        const loginUrl = new URL("/admin/login", req.url)
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