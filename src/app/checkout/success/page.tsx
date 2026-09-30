"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCartStore } from "@/lib/store/use-cart-store"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Landmark, Truck } from "lucide-react"

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get("orderNumber") || "VES-00000"
    const method = searchParams.get("method") || "COD"
    const clearCart = useCartStore((state) => state.clearCart)

    useEffect(() => {
        clearCart()
    }, [clearCart])

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 stroke-[1.5]" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Order #{orderNumber} Confirmed
      </span>

            <h1 className="text-3xl md:text-4xl font-light tracking-tight mt-2 mb-4">
                Thank You For Your Order!
            </h1>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Your order has been recorded in our system and is being processed by our team.
            </p>

            {/* Bank Details Box if Bank Transfer selected */}
            {method === "BANK_TRANSFER" && (
                <div className="bg-card border border-border p-6 text-left mb-8 space-y-3 rounded-none">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase font-mono border-b pb-2">
                        <Landmark className="h-4 w-4" /> Bank Transfer Payment Instructions
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Please transfer the total amount to our business bank account and reference your Order Number: <span className="font-mono font-bold text-foreground">{orderNumber}</span>.
                    </p>
                    <div className="text-xs space-y-1 font-mono pt-2 bg-muted/40 p-3">
                        <p><span className="text-muted-foreground">Bank:</span> Meezan Bank</p>
                        <p><span className="text-muted-foreground">Title:</span> Vestra Textiles Pvt Ltd</p>
                        <p><span className="text-muted-foreground">Account #:</span> 01020304050607</p>
                        <p><span className="text-muted-foreground">IBAN:</span> PK36MEZN0001020304050607</p>
                        <p><span className="text-muted-foreground">Raast ID:</span> 03001234567</p>
                    </div>
                </div>
            )}

            {/* COD Instructions */}
            {method === "COD" && (
                <div className="bg-card border border-border p-4 text-left mb-8 flex items-center gap-3">
                    <Truck className="h-6 w-6 text-foreground flex-shrink-0" />
                    <div className="text-xs">
                        <p className="font-semibold">Cash on Delivery Selected</p>
                        <p className="text-muted-foreground">Please keep exact cash ready when the courier arrives at your shipping address.</p>
                    </div>
                </div>
            )}

            <Link href="/shop">
                <Button className="rounded-none text-xs uppercase tracking-widest h-12 px-8 flex items-center gap-2">
                    Continue Shopping <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}