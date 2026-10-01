import { prisma } from "@/lib/prisma"
import { AdminReadyMadeManager } from "@/components/admin/admin-ready-made-manager"

export const dynamic = "force-dynamic"

export default async function AdminReadyMadePage() {
    const products = await prisma.readyMadeProduct.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    })

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    })

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold font-mono uppercase tracking-wider">
                Ready-To-Wear Inventory
            </h1>
            <AdminReadyMadeManager initialProducts={products} categories={categories} />
        </div>
    )
}