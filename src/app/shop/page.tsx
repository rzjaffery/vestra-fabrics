import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/shop/product-card"

export const revalidate = 0 // Disable cache for immediate development testing

export default async function ShopPage() {
    // Direct Server-side Database Query
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="container mx-auto px-4 py-12 md:px-8">
            {/* Header section */}
            <div className="flex flex-col gap-2 mb-10 border-b pb-6">
                <h1 className="text-3xl font-light tracking-tight md:text-5xl">
                    Fabric Collection
                </h1>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                    Sourced from international mills. Pure natural weaves engineered for timeless architecture and apparel.
                </p>
            </div>

            {/* Grid rendering */}
            {products.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No fabrics found in the catalog.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: { name: string; id: string; slug: string; description: string; price: number; images: string[]; material: string; weight: string; width: string; stock: number; isFeatured: boolean; createdAt: Date; updatedAt: Date }) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}