// app/fabrics/page.tsx
import { prisma } from "@/lib/prisma"
import { ProductCardFabric } from "@/components/store/product-card-fabric"

export const revalidate = 0

async function getFabrics() {
    try {
        const fabrics = await prisma.fabric.findMany({
            orderBy: { createdAt: "desc" },
        })
        return fabrics
    } catch (error) {
        console.error("Failed to query fabrics from database:", error)
        return []
    }
}

export default async function CustomerFabricsPage() {
    const fabrics = await getFabrics()

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="border-b border-border pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Public Catalog
        </span>
                <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
                    Fabric Collection
                </h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                    Explore our premium selection of unstitched textiles sold by the meter. Engineered for bespoke tailoring, bridal wear, and luxury fashion.
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Sidebar Filters */}
                <aside className="space-y-6">
                    <div className="border-b border-border pb-6">
                        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground mb-3">
                            Material
                        </h3>
                        <div className="space-y-2">
                            {["Silk", "Linen", "Cotton", "Wool", "Velvet", "Chiffon"].map((material) => (
                                <label
                                    key={material}
                                    className="flex items-center text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2.5">{material}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground mb-3">
                            Width Filter
                        </h3>
                        <div className="space-y-2">
                            {['44" (112 cm)', '54" (137 cm)', '60" (152 cm)'].map((width) => (
                                <label
                                    key={width}
                                    className="flex items-center text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2.5">{width}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Customer Product Cards Grid */}
                <main className="lg:col-span-3">
                    {fabrics.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/50">
                            <p className="text-sm font-mono text-muted-foreground">
                                No fabrics available in the store right now.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Please check back soon for our new collection updates.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {fabrics.map((fabric: any) => (
                                <ProductCardFabric key={fabric.id} product={fabric} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}