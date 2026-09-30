'use client'

import {useState} from "react";
import {RefreshCw} from "lucide-react";
import {formatPrice} from "@/lib/format-price";
import {Button} from "@/components/ui/button";

interface AdminOrderTableProps {
    initialOrders: any[]
}

export function AdminOrderTable({ initialOrders }: AdminOrderTableProps) {
    const [orders, setOrders] = useState(initialOrders)
    const [loadingId, setLoadingId] = useState<string|null>(null)

    const handleStatusChange = async (
        orderId: string,
        newStatus: string,
        paymentStatus?: string
    )=>{
        setLoadingId(orderId)
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    ...(paymentStatus && { paymentStatus }),
                }),
            })

            if (response.ok) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === orderId
                            ? {
                                ...order,
                                status: newStatus,
                                ...(paymentStatus && { paymentStatus }),
                            }
                            : order
                    )
                )
            }
        } catch (error) {
            console.error("Failed to update status", error)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className='border border-border bg-card overflow-x-auto'>
            <table className='w-full text-xs text-left'>
                <thead className='bg-muted/50 border-b border-border uppercase font-mono text-[11px] text-muted-foreground'>
                    <tr>
                        <th className='p-4'>Order #</th>
                        <th className='p-4'>Customer</th>
                        <th className='p-4'>City</th>
                        <th className='p-4'>Method</th>
                        <th className='p-4'>Payment Status</th>
                        <th className='p-4'>Total </th>
                        <th className='p-4'>Order Status</th>
                        <th className='p-4'>Action</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20">
                        <td className="p-4 font-mono font-semibold">{order.orderNumber}</td>
                        <td className="p-4">
                            <div className="font-medium text-foreground">{order.customerName}</div>
                            <div className="text-[11px] text-muted-foreground">{order.phone}</div>
                        </td>
                        <td className="p-4">{order.city}</td>
                        <td className="p-4 font-mono uppercase">{order.paymentMethod}</td>
                        <td className="p-4">
                <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        order.paymentStatus === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                    }`}
                >
                  {order.paymentStatus}
                </span>
                        </td>
                        <td className="p-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                        <td className="p-4">
                            <select
                                value={order.status}
                                disabled={loadingId === order.id}
                                onChange={(e) =>
                                    handleStatusChange(
                                        order.id,
                                        e.target.value,
                                        e.target.value === "DELIVERED" ? "Paid" : undefined
                                    )
                                }
                                className="bg-background border border-border rounded p-1 text-xs focus:outline-none"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </td>
                        <td className="p-4">
                            {order.paymentMethod === "BANK_TRANSFER" && order.paymentStatus !== "Paid" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={loadingId === order.id}
                                    onClick={() =>
                                        handleStatusChange(order.id, order.status, "Paid")
                                    }
                                    className="h-7 text-[10px] rounded-none uppercase tracking-wider"
                                >
                                    {loadingId === order.id ? (
                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                    ) : (
                                        "Mark Paid"
                                    )}
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}