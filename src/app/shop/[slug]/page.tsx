import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react"
import {AddToCartButton} from "@/components/shop/add-to-cart-button";

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await prisma.product.findUnique({ where: { slug } })

    if (!product) return { title: "Product Not Found | Vestra Fabric" }

    return {
        title: `${product.name} | Vestra Fabric`,
        description: product.description,
    }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug } = await params

    const product = await prisma.product.findUnique({
        where: { slug },
    })

    if (!product) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-8 max-w-7xl">
            {/* Back Button */}
            <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Collection
            </Link>

            {/* 2-Column Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Column: Fixed-Height Large Image Container */}
                <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] overflow-hidden bg-muted border border-border">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center"
                    />
                </div>

                {/* Right Column: Product Information */}
                <div className="flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                        <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {product.material}
              </span>
                            <h1 className="text-3xl md:text-5xl font-light tracking-tight mt-1 text-foreground">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-semibold mt-4 text-foreground">
                                ${product.price.toFixed(2)}{" "}
                                <span className="text-sm font-normal text-muted-foreground">/ meter</span>
                            </p>
                        </div>

                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base border-t border-border pt-4">
                            {product.description}
                        </p>

                        {/* Spec Highlights Grid */}
                        <div className="grid grid-cols-3 gap-4 border border-border p-4 text-center bg-card">
                            <div>
                                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Weight</p>
                                <p className="text-sm font-medium mt-1">{product.weight}</p>
                            </div>
                            <div className="border-x border-border px-2">
                                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Width</p>
                                <p className="text-sm font-medium mt-1">{product.width}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Availability</p>
                                <p className="text-sm font-medium mt-1 text-emerald-500">
                                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <AddToCartButton product={product}/>
                    </div>

                    {/* Value Propositions */}
                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border text-muted-foreground text-[11px]">
                        <div className="flex flex-col items-center text-center gap-2">
                            <Truck className="h-5 w-5 text-foreground" />
                            <span>Worldwide Express Delivery</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-foreground" />
                            <span>Certified Mill Quality</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <RefreshCw className="h-5 w-5 text-foreground" />
                            <span>Sample Swatches Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}