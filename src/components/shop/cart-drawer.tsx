import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useCartStore} from "@/lib/store/use-cart-store";
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Minus, Plus, ShoppingBag, Trash2} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {formatPrice} from "@/lib/format-price";

export function CartDrawer() {
    const [isMounted, setIsMounted] = useState(false)
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        getTotalPrice,
    } = useCartStore()

    // Prevent hydration mismatch between SSR and localStorage
    useEffect(() => {
        useCartStore.persist.rehydrate()
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const totalPrice = getTotalPrice()

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="flex flex-col w-full sm:max-w-lg p-6 bg-background">
                <SheetHeader className="border-b border-border pb-4">
                    <SheetTitle className="flex items-center gap-2 text-lg font-light tracking-wider uppercase">
                        <ShoppingBag className="h-5 w-5" />
                        Your Fabric Order
                    </SheetTitle>
                </SheetHeader>

                {/* Cart Items List */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
                        <p className="text-muted-foreground text-sm">
                            Your swatch bag is currently empty.
                        </p>
                        <Button
                            variant="outline"
                            onClick={closeCart}
                            className="rounded-none text-xs uppercase tracking-wider"
                        >
                            Explore Collection
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto py-4 space-y-6 divide-y divide-border/40">
                        {items.map(({ product, quantity }) => (
                            <div key={product.id} className="flex gap-4 pt-4 first:pt-0">
                                {/* Thumbnail */}
                                <div className="relative h-20 w-20 flex-shrink-0 bg-muted overflow-hidden border">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-medium leading-tight">
                                                {product.name}
                                            </h4>
                                            <button
                                                onClick={() => removeItem(product.id)}
                                                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {formatPrice(product.price)} / meter
                                        </p>
                                    </div>

                                    {/* Quantity Controller */}
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-border">
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                                className="px-2 py-1 hover:bg-muted transition-colors text-xs"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="px-3 text-xs font-mono">{quantity}m</span>
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                                className="px-2 py-1 hover:bg-muted transition-colors text-xs"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>

                                        <p className="text-sm font-semibold">
                                            {formatPrice(product.price * quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Summary */}
                {items.length > 0 && (
                    <SheetFooter className="border-t border-border pt-4 flex flex-col space-y-4">
                        <div className="flex justify-between text-base font-semibold w-full">
                            <span>Subtotal</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground text-center">
                            Taxes and shipping calculated at checkout.
                        </p>
                        <Link href="/checkout" className="w-full" onClick={closeCart}>
                            <Button className="w-full rounded-none h-12 text-xs uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}