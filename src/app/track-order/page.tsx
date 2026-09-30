"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import {
    Search,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    AlertCircle,
    Loader2,
} from "lucide-react"
import {Input} from "@base-ui/react";

const STAGES = [
    { id: "PENDING", label: "Order Placed", icon: Clock },
    { id: "PROCESSING", label: "Processing & Cutting", icon: Package },
    { id: "SHIPPED", label: "Dispatched / Shipped", icon: Truck },
    { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
]

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderNumber.trim()) return

        setLoading(true)
        setError(null)
        setOrder(null)

        try {
            const res = await fetch(
                `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`
            )
            const data = await res.json()

            if (res.ok) {
                setOrder(data.order)
            } else {
                setError(data.error || "Could not find order.")
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const getStageIndex = (status: string) => {
        switch (status) {
            case "PENDING":
                return 0
            case "PROCESSING":
                return 1
            case "SHIPPED":
                return 2
            case "DELIVERED":
                return 3
            default:
                return 0
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
            {/* Page Title */}
            <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Vestra Fabrics Logistics
        </span>
                <h1 className="text-3xl font-light tracking-tight text-foreground">
                    Track Your Order
                </h1>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Enter your reference number (e.g. <span className="font-mono font-semibold">VES-408950</span>) to check fulfillment status.
                </p>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto">
                <Input
                    type="text"
                    placeholder="e.g. VES-408950"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="rounded-none font-mono uppercase text-sm border-border focus-visible:ring-foreground"
                />
                <Button
                    type="submit"
                    disabled={loading || !orderNumber.trim()}
                    className="rounded-none px-6 font-mono text-xs uppercase"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Search className="h-4 w-4 mr-2" /> Track
                        </>
                    )}
                </Button>
            </form>

            {/* Error Message */}
            {error && (
                <div className="border border-destructive/30 bg-destructive/10 p-4 text-xs font-mono text-destructive flex items-center gap-2 max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Order Status Display Card */}
            {order && (
                <div className="border border-border bg-card space-y-8 p-6 md:p-8 animate-in fade-in duration-300">
                    {/* Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-6 gap-4 font-mono text-xs">
                        <div>
                            <p className="text-muted-foreground">Order Reference</p>
                            <p className="text-lg font-bold text-foreground">{order.orderNumber}</p>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-muted-foreground">Placed On</p>
                            <p className="text-foreground">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Cancelled Alert or Progress Tracker */}
                    {order.status === "CANCELLED" ? (
                        <div className="p-4 border border-destructive/20 bg-destructive/5 text-destructive font-mono text-xs text-center">
                            This order has been cancelled. Please contact customer support for assistance.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                Fulfillment Timeline
                            </p>

                            {/* Progress Steps */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {STAGES.map((stage, idx) => {
                                    const currentIdx = getStageIndex(order.status)
                                    const isCompleted = idx <= currentIdx
                                    const isCurrent = idx === currentIdx
                                    const Icon = stage.icon

                                    return (
                                        <div
                                            key={stage.id}
                                            className={`border p-4 text-center space-y-2 transition-colors ${
                                                isCurrent
                                                    ? "border-foreground bg-foreground/5"
                                                    : isCompleted
                                                        ? "border-emerald-500/30 bg-emerald-500/5"
                                                        : "border-border opacity-50"
                                            }`}
                                        >
                                            <div className="flex justify-center">
                                                <Icon
                                                    className={`h-5 w-5 ${
                                                        isCompleted ? "text-emerald-600" : "text-muted-foreground"
                                                    }`}
                                                />
                                            </div>
                                            <p className="font-mono text-[11px] font-semibold uppercase text-foreground">
                                                {stage.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Delivery Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border text-xs">
                        <div className="space-y-2 font-mono">
                            <p className="uppercase text-muted-foreground font-semibold flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" /> Shipping Address
                            </p>
                            <p className="font-semibold text-foreground">{order.customerName}</p>
                            <p className="text-muted-foreground">{order.address}</p>
                            <p className="text-muted-foreground">{order.city}, Pakistan {order.postalCode}</p>
                        </div>

                        <div className="space-y-2 font-mono sm:text-right">
                            <p className="uppercase text-muted-foreground font-semibold">Payment Summary</p>
                            <p className="text-muted-foreground">
                                Method: <strong className="text-foreground">{order.paymentMethod}</strong>
                            </p>
                            <p className="text-muted-foreground">
                                Status: <strong className="text-foreground">{order.paymentStatus}</strong>
                            </p>
                            <p className="text-base font-bold text-foreground mt-2">
                                Total: {formatPrice(order.totalAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Ordered Fabric Items */}
                    <div className="border-t border-border pt-6 space-y-4">
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            Ordered Items
                        </p>
                        <div className="divide-y divide-border border border-border">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-4 flex items-center justify-between text-xs font-mono">
                                    <div>
                                        <p className="font-semibold text-foreground">
                                            {item.product?.name || "Fabric Roll"}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {item.product?.material || "Standard Fabric"} • {item.product?.width || "58 in"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{item.quantity} Meter(s)</p>
                                        <p className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}