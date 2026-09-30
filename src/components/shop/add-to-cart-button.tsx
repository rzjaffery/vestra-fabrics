'use client'

import {Product} from "@prisma/client";
import {useState} from "react";
import {useCartStore} from "@/lib/store/use-cart-store";
import {Button} from "@/components/ui/button";
import {Minus, Plus, ShoppingBag} from "lucide-react";

interface AddToCartButtonProps {
    product: Product
}
export function AddToCartButton({ product }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState<number>(1)
    const addItem = useCartStore((state)=> state.addItem)

    const handleAddToCart = () => {
        addItem(product,quantity)
    }
    return (
        <div className="space-y-4">
            {/* Meter Quantity Selector */}
            <div className="flex items-center justify-between border border-border p-3 bg-card">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
          Quantity (Meters)
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
                    <span className="text-sm font-mono font-medium w-8 text-center">
            {quantity}m
          </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-none border-border"
                        onClick={() => setQuantity((prev) => prev + 1)}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Add to Cart Button */}
            <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full rounded-none tracking-widest uppercase text-xs h-14 bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2"
            >
                <ShoppingBag className="h-4 w-4" />
                {product.stock > 0 ? "Add to Fabric Cart" : "Out of Stock"}
            </Button>
        </div>
    )
}