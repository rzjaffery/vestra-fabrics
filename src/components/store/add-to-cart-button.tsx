"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/store/use-cart-store"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag, Check } from "lucide-react"

export interface AddToCartProduct {
    id: string
    name: string
    slug: string
    price: number // pricePerMeter for fabric, or unit price for ready-made
    stock: number
    images?: string[]
    imageUrl?: string
    itemType: "FABRIC" | "READY_MADE"
}

interface AddToCartButtonProps {
    product: AddToCartProduct
    selectedSize?: string // Required for READY_MADE items
    initialQuantity?: number
}

export function AddToCartButton({
                                    product,
                                    selectedSize,
                                    initialQuantity = 1,
                                }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState<number>(initialQuantity)
    const [added, setAdded] = useState<boolean>(false)
    const addItem = useCartStore((state) => state.addItem)

    const isFabric = product.itemType === "FABRIC"
    const displayImage =
        product.images?.[0] || product.imageUrl || "/placeholder-fabric.jpg"

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: displayImage,
            itemType: product.itemType,
            selectedSize: !isFabric ? selectedSize : undefined,
            meters: isFabric ? quantity : undefined,
            quantity: !isFabric ? quantity : 1,
            stock: product.stock,
        })

        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const isButtonDisabled =
        product.stock <= 0 || (!isFabric && !selectedSize)

    return (
        <div className="space-y-4">
            {/* Meter / Quantity Selector */}
            <div className="flex items-center justify-between border border-border p-3 bg-card rounded-none">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
          {isFabric ? "Quantity (Meters)" : "Quantity"}
        </span>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-none border-border"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-mono font-medium min-w-8 text-center">
            {quantity}{isFabric ? "m" : ""}
          </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-none border-border"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        disabled={quantity >= product.stock}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Add to Cart Button */}
            <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className="w-full rounded-none tracking-widest uppercase text-xs h-14 bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2"
            >
                {added ? (
                    <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        Added To Bag
                    </>
                ) : (
                    <>
                        <ShoppingBag className="h-4 w-4" />
                        {product.stock <= 0
                            ? "Out of Stock"
                            : !isFabric && !selectedSize
                                ? "Select A Size"
                                : `Add To ${isFabric ? "Fabric Cart" : "Shopping Bag"}`}
                    </>
                )}
            </Button>
        </div>
    )
}