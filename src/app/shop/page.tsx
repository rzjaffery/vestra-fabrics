import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/product-card"

export const revalidate = 0

export default async function ShopPage() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="container mx-auto px-4 py-12 md:px-8 max-w-7xl">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border pb-8">
                <div>
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            Vestra Fabric Archive
          </span>
                    <h1 className="text-3xl md:text-5xl font-light tracking-tight mt-2">
                        The Textile Collection
                    </h1>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm max-w-md leading-relaxed">
                    Curated natural weaves sourced from certified artisan mills. Engineered for bespoke fashion, luxury drapery, and interior architecture.
                </p>
            </div>

            {/* Catalog Meta */}
            <div className="flex justify-between items-center mb-6 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                <span>Showing {products.length} Materials</span>
                <span>Filter: All Categories</span>
            </div>

            {/* Multi-Column Responsive Grid */}
            {products.length === 0 ? (
                <div className="text-center py-24 border border-dashed text-muted-foreground">
                    No fabrics currently in stock.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: { id: string; name: string; slug: string; description: string; price: number; images: string[]; material: string; weight: string; width: string; stock: number; featured: boolean; createdAt: Date; updatedAt: Date }) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}