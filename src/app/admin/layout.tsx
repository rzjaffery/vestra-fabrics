import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Package, LogOut, Store } from "lucide-react"

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-muted/20">
            {/* Admin Dedicated Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col justify-between hidden md:flex">
                <div className="p-6 space-y-8">
                    <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
              Backoffice Portal
            </span>
                        <h2 className="text-lg font-light tracking-tight text-foreground mt-0.5">
                            Vestra Admin
                        </h2>
                    </div>

                    <nav className="space-y-1 font-mono text-xs uppercase tracking-wider">
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 px-3 py-2.5 rounded text-foreground hover:bg-muted transition-colors"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Orders & COD
                        </Link>
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-3 px-3 py-2.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <Package className="h-4 w-4" />
                            Inventory
                        </Link>
                    </nav>
                </div>

                {/* Sidebar Footer Link back to main storefront */}
                <div className="p-4 border-t border-border">
                    <Link
                        href="/shop"
                        className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-2"
                    >
                        <Store className="h-4 w-4" />
                        View Public Shop
                    </Link>
                </div>
            </aside>

            {/* Main Admin Dashboard Body */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
        </div>
    )
}