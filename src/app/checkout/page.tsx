"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCartStore } from "@/lib/store/use-cart-store"
import { Button } from "@/components/ui/button"
import { Truck, Landmark, CreditCard, CheckCircle, Loader2 } from "lucide-react"

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice } = useCartStore()
    const [isMounted, setIsMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        phone: "",
        address: "",
        city: "Karachi",
        postalCode: "",
        paymentMethod: "COD", // COD, BANK_TRANSFER, ONLINE_PAYMENT
        notes: "",
    })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center max-w-md">
                <h1 className="text-2xl font-light">Your cart is empty</h1>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                    Add some fabrics to your swatch bag before proceeding to checkout.
                </p>
                <Button onClick={() => router.push("/shop")} className="rounded-none text-xs uppercase tracking-widest">
                    Return to Shop
                </Button>
            </div>
        )
    }

    const subtotal = getTotalPrice()
    const shippingFee = formData.city.toLowerCase() === "karachi" ? 250 : 350 // Delivery rate in PKR
    const total = subtotal + shippingFee

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items,
                }),
            })

            const data = await response.json()

            if (data.success) {
                router.push(`/checkout/success?orderNumber=${data.orderNumber}&method=${formData.paymentMethod}`)
            } else {
                alert(data.error || "Failed to place order. Please try again.")
            }
        } catch (error) {
            console.error(error)
            alert("An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <h1 className="text-3xl font-light tracking-tight uppercase mb-8 border-b pb-4">
                Checkout & Delivery
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Shipping & Payment Info */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Shipping Address */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                            1. Delivery Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    required
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="e.g. Ali Khan"
                                    className="w-full border border-border p-3 text-sm bg-background focus:outline-none focus:border-foreground"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">Phone Number (Required for Courier) *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0300 1234567"
                                    className="w-full border border-border p-3 text-sm bg-background focus:outline-none focus:border-foreground"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Email Address *</label>
                            <input
                                type="email"
                                name="customerEmail"
                                required
                                value={formData.customerEmail}
                                onChange={handleChange}
                                placeholder="ali@example.com"
                                className="w-full border border-border p-3 text-sm bg-background focus:outline-none focus:border-foreground"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Street Address *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="House / Apartment #, Street, Block, Area"
                                className="w-full border border-border p-3 text-sm bg-background focus:outline-none focus:border-foreground"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">City *</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-border p-3 text-sm bg-background focus:outline-none focus:border-foreground"
                                >
                                    <option value="Karachi">Karachi</option>
                                    <option value="Lahore">Lahore</option>
                                    <option value="Islamabad">Islamabad</option>
                                    <option value="Rawalpindi">Rawalpindi</option>
                                    <option value="Faisalabad">Faisalabad</option>
                                    <option value="Peshawar">Peshawar</option>
                                    <option value="Quetta">Quetta</option>

                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">Postal Code (Optional)</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="75500"
                                    className="w-full border border-border p-3 text-sm bg-background focus:outline-none focus:border-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                            2. Select Payment Method
                        </h2>

                        <div className="space-y-3">
                            {/* COD Option */}
                            <label
                                className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                                    formData.paymentMethod === "COD" ? "border-foreground bg-muted/30" : "border-border"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === "COD"}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Truck className="h-4 w-4" /> Cash on Delivery (COD)
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Pay in cash when your order is delivered to your doorstep by courier.
                                    </p>
                                </div>
                            </label>

                            {/* Direct Bank Transfer Option */}
                            <label
                                className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                                    formData.paymentMethod === "BANK_TRANSFER" ? "border-foreground bg-muted/30" : "border-border"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="BANK_TRANSFER"
                                    checked={formData.paymentMethod === "BANK_TRANSFER"}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <Landmark className="h-4 w-4" /> Direct Bank Transfer / Raast
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Transfer funds directly to our Meezan Bank Account or Raast ID. Account details will be shown on the order summary.
                                    </p>
                                </div>
                            </label>

                            {/* Online Gateway Option (Safepay / PayFast) */}
                            <label
                                className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                                    formData.paymentMethod === "ONLINE_PAYMENT" ? "border-foreground bg-muted/30" : "border-border"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="ONLINE_PAYMENT"
                                    checked={formData.paymentMethod === "ONLINE_PAYMENT"}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <CreditCard className="h-4 w-4" /> Debit / Credit Card (Safepay / PayFast)
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Pay securely using local Visa, Mastercard, or UnionPay issued by Pakistani banks.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 rounded-none uppercase text-xs tracking-widest bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        {isLoading ? "Processing Order..." : "Confirm & Place Order"}
                    </Button>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5 bg-card border border-border p-6 h-fit space-y-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono border-b pb-3">
                        Order Summary
                    </h2>

                    <div className="space-y-4 max-h-80 overflow-y-auto divide-y divide-border/50">
                        {items.map(({ product, quantity }) => (
                            <div key={product.id} className="flex gap-4 pt-3 first:pt-0">
                                <div className="relative h-16 w-16 bg-muted border overflow-hidden flex-shrink-0">
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 text-xs">
                                    <h4 className="font-medium text-sm">{product.name}</h4>
                                    <p className="text-muted-foreground">{quantity} meters</p>
                                    <p className="font-mono mt-1">${(product.price * quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground text-xs">
                            <span>Items Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-xs">
                            <span>Standard Courier Delivery</span>
                            <span>PKR {shippingFee}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base border-t pt-3 mt-2">
                            <span>Total Payable</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}