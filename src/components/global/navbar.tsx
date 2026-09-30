'use client'
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import {ShoppingBag} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useCartStore} from "@/lib/store/use-cart-store";
import {CartDrawer} from "@/components/shop/cart-drawer";

export function Navbar() {

    const [isMounted, setIsMounted] = useState(false);
    const {openCart, getTotalItems} = useCartStore()

    useEffect(() => {
        setIsMounted(true)
    }, []);

    const totalItems = isMounted ? getTotalItems() : 0;

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-wider uppercase">
              Vestra
            </span>
                    </Link>

                    {/* Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        <Link href="/shop" className="hover:text-foreground transition-colors">
                            Shop Collection
                        </Link>
                        <Link href="/about" className="hover:text-foreground transition-colors">
                            Our Story
                        </Link>
                        <Link href="/track-order" className="hover:text-foreground transition-colors">
                            Track Order
                        </Link>
                        <Link href="/admin/orders" className="hover:text-foreground transition-colors">
                            Admin
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {/* Cart Trigger Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={openCart}
                            className="relative rounded-full"
                            aria-label="Open Shopping Bag"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center font-mono">
                  {totalItems}
                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Slide-over Drawer Component */}
            <CartDrawer />
        </>
    )
}