"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import { AdminPackingSlip } from "@/components/admin/admin-packing-slip"
import {
    Package,
    Phone,
    MapPin,
    ChevronDown,
    ChevronUp,
    Loader2,
    Printer,
    Eye,
} from "lucide-react"

interface AdminOrderManagerProps {
    initialOrders: any[]
}

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

export function AdminOrderManager({ initialOrders }: AdminOrderManagerProps) {
    const [orders, setOrders] = useState(initialOrders)
    const [filterStatus, setFilterStatus] = useState<string>("ALL")
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [selectedPrintOrder, setSelectedPrintOrder] = useState<any>(null)

    const filteredOrders =
        filterStatus === "ALL"
            ? orders
            : orders.filter((order) => order.status === filterStatus)

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id)
    }

    const handleStatusUpdate = async (
        orderId: string,
        newStatus: string,
        paymentStatus?: string
    ) => {
        setLoadingId(orderId)
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    ...(paymentStatus && { paymentStatus }),
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setOrders(
                    orders.map((o) => (o.id === orderId ? { ...o, ...data.order } : o))
                )
            } else {
                alert(data.error || "Failed to update order status")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-amber-500/10 text-amber-600 border-amber-200"
            case "PROCESSING":
                return "bg-blue-500/10 text-blue-600 border-blue-200"
            case "SHIPPED":
                return "bg-purple-500/10 text-purple-600 border-purple-200"
            case "DELIVERED":
                return "bg-emerald-500/10 text-emerald-600 border-emerald-200"
            case "CANCELLED":
                return "bg-destructive/10 text-destructive border-destructive/20"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4 font-mono text-xs">
                {["ALL", ...STATUS_OPTIONS].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 uppercase transition-colors ${
                            filterStatus === status
                                ? "bg-foreground text-background font-semibold"
                                : "bg-card border border-border text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {status} ({status === "ALL" ? orders.length : orders.filter(o => o.status === status).length})
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border uppercase font-mono text-[11px] text-muted-foreground">
                    <tr>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-muted-foreground font-mono">
                                No orders found matching status: {filterStatus}
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((order) => {
                            const isExpanded = expandedOrderId === order.id
                            const isLoading = loadingId === order.id

                            return (
                                <tr key={order.id} className="hover:bg-muted/20">
                                    <td className="p-4 font-mono font-bold text-foreground">
                                        {order.orderNumber}
                                    </td>
                                    <td className="p-4 font-mono text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-semibold text-foreground">{order.customerName}</p>
                                        <p className="text-[11px] text-muted-foreground font-mono">{order.phone}</p>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-foreground">
                                        {formatPrice(order.totalAmount)}
                                    </td>
                                    <td className="p-4 font-mono">
                      <span className="px-2 py-0.5 text-[10px] bg-muted border border-border uppercase text-muted-foreground rounded">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                                    </td>
                                    <td className="p-4 font-mono">
                      <span
                          className={`px-2 py-1 text-[10px] border uppercase font-bold rounded ${getStatusBadge(
                              order.status
                          )}`}
                      >
                        {order.status}
                      </span>
                                    </td>
                                    <td className="p-4 text-right ">
                                        {/* Print Invoice / Slip Button */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedPrintOrder(order)}
                                            className="w-15 h-8 text-[11px] rounded-none font-mono gap-1"
                                            title="Print Invoice / Packing Slip"
                                        >
                                            <Printer className="h-3.5 w-3.5" />
                                            {/*<span>Print Invoice</span>*/}
                                        </Button>

                                        {/* Inspect / Expand Button */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => toggleExpand(order.id)}
                                            className="h-8 w-15 text-[11px] rounded-none font-mono gap-1"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {/* Expanded Details Section (when "Inspect" is toggled) */}
            {expandedOrderId && (() => {
                const order = orders.find((o) => o.id === expandedOrderId)
                if (!order) return null
                const isLoading = loadingId === order.id

                return (
                    <div className="border border-border bg-card p-6 space-y-6 text-xs">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                            <h3 className="font-mono text-sm font-bold uppercase">
                                Order Details — {order.orderNumber}
                            </h3>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedPrintOrder(order)}
                                className="rounded-none text-xs gap-1 font-mono"
                            >
                                <Printer className="h-3.5 w-3.5" /> Print Packing Slip / Invoice
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Address */}
                            <div className="space-y-2 bg-muted/20 border border-border p-4">
                                <p className="font-mono uppercase font-semibold text-[11px] text-muted-foreground flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" /> Shipping Address
                                </p>
                                <p className="font-medium">{order.customerName}</p>
                                <p>{order.address}</p>
                                <p>{order.city}, Pakistan {order.postalCode ? `(${order.postalCode})` : ""}</p>
                                <p className="font-mono text-muted-foreground flex items-center gap-1 mt-2">
                                    <Phone className="h-3.5 w-3.5" /> {order.phone}
                                </p>
                            </div>

                            {/* Status Controls */}
                            <div className="space-y-3 bg-muted/20 border border-border p-4">
                                <p className="font-mono uppercase font-semibold text-[11px] text-muted-foreground flex items-center gap-1.5">
                                    <Package className="h-3.5 w-3.5" /> Fulfillment Controls
                                </p>

                                <div className="space-y-2">
                                    <label className="block text-[11px] text-muted-foreground">Update Order Status:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {STATUS_OPTIONS.map((status) => (
                                            <Button
                                                key={status}
                                                size="sm"
                                                disabled={isLoading}
                                                variant={order.status === status ? "default" : "outline"}
                                                onClick={() => handleStatusUpdate(order.id, status)}
                                                className="h-7 text-[10px] rounded-none font-mono"
                                            >
                                                {isLoading && order.status === status && (
                                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                )}
                                                {status}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-border flex items-center justify-between">
                                    <span className="text-[11px] text-muted-foreground">Payment Status:</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={isLoading}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                order.id,
                                                order.status,
                                                order.paymentStatus === "Paid" ? "Pending COD" : "Paid"
                                            )
                                        }
                                        className="h-7 text-[10px] rounded-none font-mono"
                                    >
                                        Mark as {order.paymentStatus === "Paid" ? "Pending COD" : "Paid"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border border-border bg-card">
                            <div className="bg-muted/50 p-3 font-mono text-[11px] uppercase font-semibold border-b border-border">
                                Ordered Items / Fabric Yardage
                            </div>
                            <div className="divide-y divide-border">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="p-3 flex items-center justify-between font-mono">
                                        <div>
                                            <p className="font-semibold text-foreground text-xs">
                                                {item.product?.name || "Fabric Roll"}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {item.product?.material || "Standard Fabric"} • {item.product?.width || "58 in"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p>
                                                Quantity: <strong className="text-foreground">{item.quantity} meter(s)</strong>
                                            </p>
                                            <p className="text-muted-foreground">
                                                {formatPrice(item.price)} / meter = {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })()}

            {/* Printable Invoice / Packing Slip Modal */}
            {selectedPrintOrder && (
                <AdminPackingSlip
                    order={selectedPrintOrder}
                    onClose={() => setSelectedPrintOrder(null)}
                />
            )}
        </div>
    )
}