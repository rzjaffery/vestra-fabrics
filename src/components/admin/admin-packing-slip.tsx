"use client"

import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import { Printer, X } from "lucide-react"

interface AdminPackingSlipProps {
    order: any
    onClose: () => void
}

export function AdminPackingSlip({ order, onClose }: AdminPackingSlipProps) {
    const handlePrint = () => {
        window.print()
    }

    const storeName = "VESTRA FABRICS"

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
            <style>{`
                @media print {
                    /* FORCE DOCUMENT TO STRICTLY 1 PAGE HEIGHT */
                    html, body {
                        height: 100vh !important;
                        max-height: 100vh !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }

                    /* Hide all background content visually */
                    body * {
                        visibility: hidden !important;
                    }

                    /* Make ONLY the invoice sheet visible */
                    #printable-invoice,
                    #printable-invoice * {
                        visibility: visible !important;
                    }

                    /* Position the invoice at top-left of the single printed sheet */
                    #printable-invoice {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        max-height: 100vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                        color: black !important;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }
                }
            `}</style>

            <div className="bg-card border border-border w-full max-w-2xl p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:border-none print:shadow-none font-sans">
                {/* Modal Header Controls (Screen Only) */}
                <div className="flex justify-between items-center border-b border-border pb-3 print:hidden">
                    <h3 className="font-mono text-xs uppercase text-muted-foreground">
                        Print Invoice / Packing Slip
                    </h3>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handlePrint}
                            size="sm"
                            className="rounded-none text-xs gap-2 uppercase tracking-wider font-mono"
                        >
                            <Printer className="h-4 w-4" /> Print / Save as PDF
                        </Button>
                        <button onClick={onClose} className="p-1 hover:bg-muted">
                            <X className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Printable Invoice Sheet (Fits exact 1 page) */}
                <div
                    id="printable-invoice"
                    className="p-6 border border-border space-y-4 bg-white text-black font-sans print:p-0 print:border-none print:space-y-3"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-3">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight uppercase">{storeName}</h1>
                            <p className="text-xs text-neutral-500">Official Packing Slip & Invoice</p>
                        </div>
                        <div className="text-right font-mono text-xs">
                            <p className="font-bold text-sm">{order.orderNumber}</p>
                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b pb-3">
                        <div>
                            <p className="text-neutral-500 uppercase font-bold text-[10px] mb-1">Customer Details</p>
                            <p className="font-bold">{order.customerName}</p>
                            <p>{order.customerEmail}</p>
                            <p>{order.phone}</p>
                        </div>
                        <div>
                            <p className="text-neutral-500 uppercase font-bold text-[10px] mb-1">Shipping Address</p>
                            <p>{order.address}</p>
                            <p>{order.city}, Pakistan</p>
                            <p className="mt-1 font-bold">Payment Method: {order.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="border-b bg-neutral-100 uppercase text-[10px]">
                            <tr>
                                <th className="p-2">Item Description</th>
                                <th className="p-2 text-center">Qty (Meters)</th>
                                <th className="p-2 text-right">Price/m</th>
                                <th className="p-2 text-right">Total</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {order.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="p-2 font-semibold">{item.product?.name || "Fabric Item"}</td>
                                    <td className="p-2 text-center">{item.quantity}m</td>
                                    <td className="p-2 text-right">{formatPrice(item.price)}</td>
                                    <td className="p-2 text-right font-bold">
                                        {formatPrice(item.price * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Summary */}
                    <div className="border-t pt-3 flex justify-between items-center font-mono text-xs">
                        <span className="font-bold uppercase">Total Amount Due</span>
                        <span className="text-base font-bold">{formatPrice(order.totalAmount)}</span>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-[10px] text-neutral-400 font-mono pt-3 border-t">
                        Thank you for shopping with us! Order reference {order.orderNumber}.
                    </div>
                </div>
            </div>
        </div>
    )
}