// components/product-card-fabric.tsx
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import { formatPrice } from "@/lib/format-price"

export interface ProductCardItem {
    id: string
    name: string
    slug: string
    material?: string | null
    images?: string[]
    imageUrl?: string | null
    price?: number
    pricePerMeter?: number
    stock?: number
    inStockMeters?: number
    weight?: string | number | null
    weightGsm?: number | null
    width?: string | number | null
    widthInches?: number | null
    featured?: boolean
}

interface ProductCardProps {
    product: ProductCardItem
}

export function ProductCardFabric({ product }: ProductCardProps) {
    // Normalize fields between Fabric and General Product models
    const displayImage = product.images?.[0] || product.imageUrl || "/placeholder-fabric.jpg"
    const displayPrice = product.pricePerMeter ?? product.price ?? 0
    const displayStock = product.stock ?? product.inStockMeters ?? 0
    const displayMaterial = product.material || "Premium Textile"

    const displayWeight = product.weight
        ? String(product.weight)
        : product.weightGsm
            ? `${product.weightGsm} GSM`
            : null

    const displayWidth = product.width
        ? String(product.width)
        : product.widthInches
            ? `${product.widthInches}"`
            : null

    const href = `/fabrics/${product.slug || product.id}`

    return (
        <div className="group relative flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:border-foreground/40 rounded-sm">
            {/* Fixed Height Image Container */}
            <div className="relative w-full h-80 overflow-hidden bg-muted">
                <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    {product.featured ? (
                        <Badge className="bg-background/90 text-foreground backdrop-blur-sm rounded-none px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase border-none">
                            Featured
                        </Badge>
                    ) : (
                        <div />
                    )}

                    <span
                        className={`backdrop-blur-sm text-[10px] font-mono px-2 py-0.5 rounded-none border ${
                            displayStock > 0
                                ? "bg-background/80 text-foreground border-border/40"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                    >
            {displayStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
                </div>
            </div>

            {/* Card Details */}
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                        {displayMaterial}
                    </p>
                    <h3 className="font-medium text-base tracking-tight text-foreground group-hover:underline underline-offset-4 flex items-center justify-between">
                        <Link href={href}>
                            <span className="absolute inset-0" />
                            {product.name}
                        </Link>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                </div>

                {/* Specs */}
                {(displayWeight || displayWidth) && (
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border/50 pt-3 font-mono">
                        {displayWeight && (
                            <span className="bg-muted px-2 py-0.5 rounded-none text-[10px]">
                {displayWeight}
              </span>
                        )}
                        {displayWeight && displayWidth && <span>•</span>}
                        {displayWidth && (
                            <span className="bg-muted px-2 py-0.5 rounded-none text-[10px]">
                {displayWidth}
              </span>
                        )}
                    </div>
                )}

                {/* Pricing */}
                <div className="flex items-baseline justify-between border-t border-border/50 pt-3">
          <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
            Price / Meter
          </span>
                    <span className="text-lg font-semibold tracking-tight font-mono text-foreground">
            {formatPrice(displayPrice)}
          </span>
                </div>
            </div>
        </div>
    )
}