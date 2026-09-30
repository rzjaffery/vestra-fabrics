'use client'

import {useState} from "react";
import {formatPrice} from "@/lib/format-price";
import {Button} from "@/components/ui/button";
import {AlertCircle, CheckCircle2, Clock, Loader2, Package, Search, Truck} from "lucide-react";
import Image from "next/image";

export default function TrackOrderPage(){
    const [orderNumber, setOrderNumber] = useState("")
    const [order, setOrder] = useState<any>(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderNumber.trim()) return

        setIsLoading(true)
        setError("")
        setOrder(null)

        try {
            const response = await fetch(`/api/track?orderNumber=${encodeURIComponent(orderNumber)}`)
            const data = await response.json()

            if (response.ok && data.order) {
                setOrder(data.order)
            } else {
                setError(data.error || "Order not found. Check your order number and try again.")
            }
        } catch (err) {
            setError("An error occurred while tracking your order.")
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusStep = (status: string) => {
        switch (status) {
            case "PENDING":
                return 1
            case "PROCESSING":
                return 2
            case "SHIPPED":
                return 3
            case "DELIVERED":
                return 4
            default:
                return 1
        }
    }
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Customer Service
        </span>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                    Track Your Fabric Order
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                    Enter your order number (e.g. VES-123456) received in your confirmation screen.
                </p>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-10">
                <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter Order # (e.g. VES-849201)"
                    className="flex-1 border border-border p-3 text-sm font-mono uppercase bg-background focus:outline-none focus:border-foreground"
                    required
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-none px-6 uppercase text-xs tracking-widest bg-foreground text-background"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
            </form>

            {/* Error Message */}
            {error && (
                <div className="border border-destructive/50 bg-destructive/10 text-destructive p-4 text-xs flex items-center gap-2 max-w-md mx-auto mb-8">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Order Details Display */}
            {order && (
                <div className="border border-border bg-card p-6 md:p-8 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                        <div>
                            <span className="text-xs font-mono text-muted-foreground uppercase">Order Number</span>
                            <h3 className="text-xl font-mono font-bold">{order.orderNumber}</h3>
                        </div>
                        <div className="text-left sm:text-right">
                            <span className="text-xs text-muted-foreground block">Placed On</span>
                            <span className="text-xs font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Status Tracker Steps */}
                    <div className="grid grid-cols-4 gap-2 py-4 border-b">
                        {[
                            { label: "Pending", icon: Clock, step: 1 },
                            { label: "Processing", icon: Package, step: 2 },
                            { label: "Shipped", icon: Truck, step: 3 },
                            { label: "Delivered", icon: CheckCircle2, step: 4 },
                        ].map(({ label, icon: Icon, step }) => {
                            const currentStep = getStatusStep(order.status)
                            const isActive = currentStep >= step
                            return (
                                <div key={label} className="flex flex-col items-center text-center space-y-2">
                                    <div
                                        className={`h-10 w-10 rounded-full flex items-center justify-center border transition-colors ${
                                            isActive
                                                ? "bg-foreground text-background border-foreground"
                                                : "border-border text-muted-foreground"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className={`text-[11px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Items Summary */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Order Items</h4>
                        <div className="divide-y divide-border">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 py-3">
                                    <div className="relative h-14 w-14 bg-muted border overflow-hidden flex-shrink-0">
                                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 text-xs">
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-muted-foreground">{item.quantity} meters</p>
                                    </div>
                                    <p className="text-xs font-mono font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total & Delivery Address */}
                    <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <p className="font-mono text-muted-foreground uppercase">Shipping To</p>
                            <p className="font-medium mt-1">{order.customerName}</p>
                            <p className="text-muted-foreground">{order.address}, {order.city}</p>
                            <p className="text-muted-foreground">{order.phone}</p>
                        </div>
                        <div className="sm:text-right space-y-1">
                            <p className="font-mono text-muted-foreground uppercase">Payment Details</p>
                            <p><span className="text-muted-foreground">Method:</span> {order.paymentMethod}</p>
                            <p><span className="text-muted-foreground">Payment Status:</span> {order.paymentStatus}</p>
                            <p className="text-sm font-bold pt-2 border-t mt-2">Total: {formatPrice(order.totalAmount)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}