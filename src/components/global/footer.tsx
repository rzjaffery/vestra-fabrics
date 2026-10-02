import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border bg-card mt-7">
            <div className="container mx-auto px-4 py-12 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left space-y-1">
                    <p className="text-sm font-light uppercase tracking-widest">Vestra Fabrics</p>
                    <p className="text-xs text-muted-foreground">Premium textiles engineered for modern luxury apparel.</p>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono">
                    <Link href="/shop" className="hover:text-foreground transition-colors">
                        Shop
                    </Link>
                    <Link href="/track-order" className="hover:text-foreground transition-colors">
                        Order Tracker
                    </Link>
                    <Link href="/admin/auth/login" className="hover:text-foreground transition-colors text-[10px] uppercase">
                        Staff Portal
                    </Link>
                </div>
            </div>
        </footer>
    )
}