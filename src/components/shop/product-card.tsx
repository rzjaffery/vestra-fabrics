import Image from "next/image"
import Link from "next/link"
import { Product } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import {formatPrice} from "@/lib/format-price";

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:border-foreground/40">
            {/* Fixed Height Image Container */}
            <div className="relative w-full h-80 overflow-hidden bg-muted">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    {product.isFeatured ? (
                        <Badge className="bg-background/90 text-foreground backdrop-blur-sm rounded-none px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase border-none">
                            Featured
                        </Badge>
                    ) : (
                        <div />
                    )}

                    <span className="bg-background/80 text-foreground/80 backdrop-blur-sm text-[10px] font-medium px-2 py-0.5 rounded-none border border-border/40">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
                </div>
            </div>

            {/* Card Details */}
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
                        {product.material}
                    </p>
                    <h3 className="font-medium text-base tracking-tight text-foreground group-hover:underline underline-offset-4 flex items-center justify-between">
                        <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </h3>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border/50 pt-3">
          <span className="bg-muted px-2 py-0.5 rounded-none font-mono text-[10px]">
            {product.weight}
          </span>
                    <span>•</span>
                    <span className="bg-muted px-2 py-0.5 rounded-none font-mono text-[10px]">
            {product.width}
          </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline justify-between border-t border-border/50 pt-3">
          <span className="text-xs uppercase text-muted-foreground tracking-wider">
            Price / Meter
          </span>
                    <span className="text-lg font-semibold tracking-tight text-foreground">
            {formatPrice(product.price)}
          </span>
                </div>
            </div>
        </div>
    )
}