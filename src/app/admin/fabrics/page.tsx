import { prisma } from "@/lib/prisma"
import { AdminFabricManager } from "@/components/admin/admin-fabric-manager"

export const dynamic = "force-dynamic"

export default async function AdminFabricsPage() {
    const fabrics = await prisma.fabric.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold font-mono uppercase tracking-wider">
                Unstitched Fabric Inventory
            </h1>
            <AdminFabricManager initialFabrics={fabrics} />
        </div>
    )
}