"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Layers, Store, Scissors } from "lucide-react"

const navItems = [
    {
        href: "/admin",
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        href: "/admin/orders",
        label: "Orders & COD",
        icon: ShoppingBag,
    },
    {
        href: "/admin/fabrics",
        label: "Fabric Inventory",
        icon: Layers,
    },
    {
        href: "/admin/ready-made",
        label: "Ready Made Collection",
        icon: Scissors,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    const checkIsActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin"
        }
        return pathname.startsWith(href)
    }

    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col justify-between hidden md:flex min-h-screen">
            <div className="p-6 space-y-8">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                        Management Portal
                    </span>
                    <h2 className="text-lg font-light tracking-tight text-foreground mt-0.5">
                        Vestra Fabrics
                    </h2>
                </div>

                <nav className="space-y-1 font-mono text-xs uppercase tracking-wider">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = checkIsActive(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                                    isActive
                                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-border">
                <Link
                    href="/fabrics"
                    className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-2"
                >
                    <Store className="h-4 w-4" />
                    Public Storefront
                </Link>
            </div>
        </aside>
    )
}