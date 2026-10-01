// app/admin/fabrics/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import { Plus, Layers, Trash2 } from "lucide-react"
import { revalidatePath } from "next/cache"

export const revalidate = 0

// Server Action to insert fabric directly into DB
async function addFabric(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Add Fabric Form */}
                <div className="lg:col-span-4 border border-border bg-card p-6 rounded-lg h-fit space-y-4">
                    <h2 className="text-sm font-mono uppercase tracking-wider font-semibold border-b border-border pb-3">
                        Add New Fabric
                    </h2>

                    <form action={addFabric} className="space-y-3 text-xs">
                        <div>
                            <label className="block text-muted-foreground mb-1 font-mono">Fabric Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Pure Silk Charmeuse"
                                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-muted-foreground mb-1 font-mono">Material</label>
                                <input
                                    type="text"
                                    name="material"
                                    required
                                    placeholder="100% Silk"
                                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-muted-foreground mb-1 font-mono">Price / Meter (PKR)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    required
                                    placeholder="25.00"
                                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-muted-foreground mb-1 font-mono">Stock (m)</label>
                                <input
                                    type="number"
                                    name="stock"
                                    required
                                    placeholder="100"
                                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-muted-foreground mb-1 font-mono">GSM</label>
                                <input
                                    type="number"
                                    name="weightGsm"
                                    placeholder="120"
                                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-muted-foreground mb-1 font-mono">Width (&quot;)</label>
                                <input
                                    type="number"
                                    name="widthInches"
                                    placeholder="54"
                                    className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-muted-foreground mb-1 font-mono">Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                placeholder="/images/fabrics/silk.jpg"
                                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Add to Catalog
                        </Button>
                    </form>
                </div>

                {/* Existing Fabrics Table */}
                <div className="lg:col-span-8 border border-border bg-card p-6 rounded-lg space-y-4">
                    <h2 className="text-sm font-mono uppercase tracking-wider font-semibold border-b border-border pb-3">
                        Existing Fabrics Inventory ({fabrics.length})
                    </h2>

                    <div className="divide-y divide-border overflow-x-auto">
                        {fabrics.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-6 text-center">
                                No fabrics found in the database. Use the form to add one.
                            </p>
                        ) : (
                            fabrics.map((item: any) => (
                                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <p className="text-muted-foreground font-mono text-[10px]">
                                            {item.material} • {item.widthInches ? `${item.widthInches}"` : "N/A"} • {item.weightGsm ? `${item.weightGsm} GSM` : "N/A"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-semibold">
                                            {formatPrice(item.pricePerMeter || item.price || 0)}/m
                                        </p>
                                        <span className={`text-[10px] font-mono ${item.stock < 50 ? "text-destructive" : "text-emerald-500"}`}>
                      {item.stock}m remaining
                    </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}