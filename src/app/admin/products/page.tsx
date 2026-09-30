import { prisma } from "@/lib/prisma"
import { AdminProductManager } from "@/components/admin/admin-product-manager"

export const revalidate = 0

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-8">
            <div>
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Inventory Control
        </span>
                <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
                    Fabric Catalog & Stock
                </h1>
            </div>

            <AdminProductManager initialProducts={products} />
        </div>
    )
}