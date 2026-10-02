// app/admin/fabrics/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import { Plus, Layers, Trash2 } from "lucide-react"
import { revalidatePath } from "next/cache"
import {AdminFabricManager} from "@/components/admin/admin-fabric-manager";

export const revalidate = 0

// Server Action to insert fabric directly into DB
async function addFabric(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const material = formData.get("material") as string
    const price = parseFloat(formData.get("price") as string)
    const stock = parseFloat(formData.get("stock") as string)
    const weightGsm = formData.get("weightGsm") as string
    const widthInches = formData.get("widthInches") as string
    const imageUrl = (formData.get("imageUrl") as string) || "/placeholder-fabric.jpg"
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    await prisma.fabric.create({
        data: {
            name,
            slug,
            material,
            description,
            price,
            stock,
            weight: weightGsm ? `${weightGsm} GSM` : null,
            width: widthInches ? `${widthInches}"` : null,
            images: [imageUrl],
        },
    })

    revalidatePath("/admin/fabrics")
    revalidatePath("/fabrics")
}

export default async function AdminFabricsPage() {
    const fabrics = await prisma.fabric.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Inventory Management
          </span>
                    <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
                        Fabric Catalog
                    </h1>
                </div>
            </div>
            <AdminFabricManager/>
        </div>

    )
}