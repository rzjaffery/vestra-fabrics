import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import {
    TrendingUp,
    AlertTriangle,
    Layers,
    ArrowRight,
    Clock,
} from "lucide-react"
import {Stack} from "@phosphor-icons/react";
import {Stalemate} from "next/dist/compiled/@next/font/dist/google";

export const revalidate = 0

export default async function AdminDashboardOverview() {
    let orders: any[] = []
    let fabrics: any[] = []
    let readyMadeProducts: any[] = []

    try {
        const [fetchedOrders, fetchedFabrics, fetchedReadyMade] = await Promise.all([
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
            }),
            prisma.fabric.findMany({
                orderBy: { stock: "asc" },
            }),
            prisma.readyMadeProduct.findMany({
                take: 5,
            }),
        ])

        orders = fetchedOrders
        fabrics = fetchedFabrics
        readyMadeProducts = fetchedReadyMade
    } catch (error) {
        console.error("Dashboard database fetch error:", error)
    }

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
    const pendingOrders = orders.filter((o: any) => o.status === "PENDING").length
    const lowStockFabrics = fabrics.filter((f: any) => f.stock < 50)

    // 1. Prioritize pending/processing orders at the top
    const ordersToComplete = [...orders]
        .sort((a, b) => {
            const statusPriority: Record<string, number> = { PENDING: 1, PROCESSING: 2, SHIPPED: 3, DELIVERED: 4 }
            const rankA = statusPriority[a.status] || 99
            const rankB = statusPriority[b.status] || 99
            return rankA - rankB
        })
        .slice(0, 5)

// 2. Prioritize Fabrics with stock < 50m at the top, fallback to latest
    const sortedFabrics = [...fabrics]
        .sort((a, b) => {
            const aLow = a.stock < 50
            const bLow = b.stock < 50
            if (aLow && !bLow) return -1
            if (!aLow && bLow) return 1
            return 0 // retains latest creation order
        })
        .slice(0, 5)

// 3. Prioritize Ready-Made products with stock < 20 at the top, fallback to latest
    const sortedReadyMade = [...readyMadeProducts]
        .sort((a, b) => {
            const aLow = a.stock < 20
            const bLow = b.stock < 20
            if (aLow && !bLow) return -1
            if (!aLow && bLow) return 1
            return 0 // retains latest creation order
        })
        .slice(0, 5)

    return (
        <div className="space-y-8">
            <div>
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Analytics & Status
                </span>
                <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
                    Store Operations Overview
                </h1>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-border p-5 bg-card rounded-lg">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Total Sales</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-semibold">{formatPrice(totalRevenue)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Gross order volume</p>
                </div>

                <div className="border border-border p-5 bg-card rounded-lg">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Pending Orders</span>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-semibold">{pendingOrders}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Awaiting verification</p>
                </div>

                <div className="border border-border p-5 bg-card rounded-lg">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Active Fabrics</span>
                        <Layers className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-semibold">{fabrics.length}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Fabric listings in catalog</p>
                </div>

                <div className="border border-border p-5 bg-card rounded-lg">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Active Ready Made</span>
                        <Layers className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-semibold">{readyMadeProducts.length}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Stitched listings in catalog</p>
                </div>

                {/*<div className="border border-border p-5 bg-card rounded-lg">*/}
                {/*    <div className="flex items-center justify-between text-muted-foreground mb-2">*/}
                {/*        <span className="text-xs font-mono uppercase tracking-wider">Low Stock Warning</span>*/}
                {/*        <AlertTriangle className="h-4 w-4 text-destructive" />*/}
                {/*    </div>*/}
                {/*    <p className="text-2xl font-semibold text-destructive">{lowStockFabrics.length}</p>*/}
                {/*    <p className="text-[11px] text-muted-foreground mt-1">Fabrics under 50m remaining</p>*/}
                {/*</div>*/}
            </div>

            {/* Three-Column Activity View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Orders to Complete */}
                <div className="border border-border bg-card p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                                Orders To Complete
                            </h2>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Pending & processing queue</p>
                        </div>
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider gap-1">
                                View All <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {ordersToComplete.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4">No pending orders found.</p>
                        ) : (
                            ordersToComplete.map((order: any) => (
                                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-mono font-semibold">{order.orderNumber}</p>
                                        <p className="text-muted-foreground">
                                            {order.customerName} • {order.city || "N/A"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-semibold">{formatPrice(order.totalAmount)}</p>
                                        <span
                                            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                                order.status === "PENDING"
                                                    ? "bg-amber-500/10 text-amber-600 font-bold"
                                                    : order.status === "PROCESSING"
                                                        ? "bg-blue-500/10 text-blue-600 font-bold"
                                                        : "text-muted-foreground"
                                            }`}
                                        >
                                {order.status}
                            </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Column 2: Fabric Stock Alerts */}
                <div className="border border-border bg-card p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                                Fabric Rolls Inventory
                            </h2>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Low stock (&lt;50m) listed first</p>
                        </div>
                        <Link href="/admin/fabrics">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider gap-1">
                                Manage <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {sortedFabrics.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4">No fabric inventory found.</p>
                        ) : (
                            sortedFabrics.map((fabric: any) => (
                                <div key={fabric.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-medium">{fabric.name}</p>
                                        <p className="text-muted-foreground font-mono text-[11px]">
                                            {fabric.material || "Standard"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                            <span
                                className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                                    fabric.stock < 50
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-emerald-500/10 text-emerald-600"
                                }`}
                            >
                                {fabric.stock}m remaining
                            </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Column 3: Ready-Made Stock Alerts */}
                <div className="border border-border bg-card p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                                Ready Made Collection
                            </h2>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Low stock (&lt;20 pcs) listed first</p>
                        </div>
                        <Link href="/admin/ready-made">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider gap-1">
                                Manage <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {sortedReadyMade.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4">No ready-made products found.</p>
                        ) : (
                            sortedReadyMade.map((product: any) => (
                                <div key={product.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-muted-foreground font-mono text-[11px]">
                                            {product.category || "Apparel"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                            <span
                                className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                                    product.stock < 20
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-emerald-500/10 text-emerald-600"
                                }`}
                            >
                                {product.stock} pcs left
                            </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}