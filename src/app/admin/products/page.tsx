import { AdminProductManager } from "@/components/admin/admin-product-manager"

async function getProducts() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/products`,
            { cache: "no-store" }
        )
        if (!res.ok) return []
        const data = await res.json()
        return data.products || []
    } catch (err) {
        console.error(err)
        return []
    }
}

export default async function AdminFabricPage() {
    const products = await getProducts()

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-light uppercase tracking-wider text-foreground">
                    Fabric Inventory
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                    Manage raw fabric rolls, material types, and per-meter pricing.
                </p>
            </div>

            <AdminProductManager initialProducts={products} mode="FABRIC" />
        </div>
    )
}