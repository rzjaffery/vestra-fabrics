// app/ready-made/page.tsx
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/product-card"

export const revalidate = 0

async function getReadyMadeProducts() {
    try {
        const products = await prisma.readyMadeProduct.findMany({
            orderBy: { createdAt: "desc" },
        })
        return products
    } catch (error) {
        console.error("Failed to fetch ready made products from database:", error)
        return []
    }
}

export default async function ReadyMadePage() {
    const products = await getReadyMadeProducts()

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="border-b border-border pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Stitched & Ready To Wear
        </span>
                <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
                    Ready Made Collection
                </h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                    Pre-stitched couture, formal wear, and everyday garments crafted from our finest fabrics with expert tailoring.
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Sidebar Filters */}
                <aside className="space-y-6">
                    {/* Category Filter */}
                    <div className="border-b border-border pb-6">
                        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground mb-3">
                            Category
                        </h3>
                        <div className="space-y-2">
                            {["Kurtas & Tunics", "Formals & Partywear", "Co-ord Sets", "Bridal Edition", "Pret Collection"].map((category) => (
                                <label
                                    key={category}
                                    className="flex items-center text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2.5">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground mb-3">
                            Available Size
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {["XS", "S", "M", "L", "XL", "Custom"].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className="border border-border py-1.5 text-xs font-mono hover:border-foreground transition-colors rounded-none bg-card hover:bg-accent text-center"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Cards Grid */}
                <main className="lg:col-span-3">
                    {products.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/50">
                            <p className="text-sm font-mono text-muted-foreground">
                                No ready made items available in the store right now.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Please check back soon or manage inventory in the Admin Portal.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((item: any) => {
                                // Mapping product data cleanly into ProductCard shape
                                const mappedProduct = {
                                    id: item.id,
                                    name: item.name,
                                    slug: item.slug || item.id,
                                    material: item.category || item.material || "Ready To Wear",
                                    images: item.images?.length > 0 ? item.images : item.imageUrl ? [item.imageUrl] : ["/placeholder-product.jpg"],
                                    price: item.price ?? 0,
                                    stock: item.stock ?? 0,
                                    featured: item.featured ?? false,
                                }

                                return <ProductCard key={item.id} product={mappedProduct} />
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}