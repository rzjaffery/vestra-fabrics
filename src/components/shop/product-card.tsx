import Image from "next/image"
import Link from "next/link"
import { Product } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="group overflow-hidden rounded-none border-border/50 bg-background transition-all duration-300 hover:border-foreground/20">
            <CardHeader className="p-0">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isFeatured && (
                        <Badge className="absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur-md hover:bg-background rounded-none font-mono text-[10px] tracking-widest uppercase">
                            Featured
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <p className="text-xs text-muted-foreground tracking-wider uppercase font-medium">
                            {product.material}
                        </p>
                        <h3 className="font-medium text-base tracking-tight mt-1 group-hover:underline underline-offset-4">
                            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                        </h3>
                    </div>
                    <p className="font-semibold text-sm">
                        ${product.price.toFixed(2)} <span className="text-xs text-muted-foreground font-normal">/m</span>
                    </p>
                </div>
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-0 flex justify-between text-xs text-muted-foreground border-t border-border/30 pt-3 mt-2">
                <span>{product.weight}</span>
                <span>{product.width}</span>
            </CardFooter>
        </Card>
    )
}