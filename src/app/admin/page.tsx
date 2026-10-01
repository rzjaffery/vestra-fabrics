// app/admin/page.tsx
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

export const revalidate = 0

export default async function AdminDashboardOverview() {
    // Fetch orders and fabrics concurrently
    const [orders, fabrics, readyMadeProducts] = await Promise.all([
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

    const totalRevenue = orders.reduce((sum: any, order: { totalAmount: any }) => sum + order.totalAmount, 0)
    const pendingOrders = orders.filter((o:any) => o.status === "PENDING").length
    const lowStockFabrics = fabrics.filter((f:any) => f.stock < 50)

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
                        <span className="text-xs font-mono uppercase tracking-wider">Low Stock Warning</span>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <p className="text-2xl font-semibold text-destructive">{lowStockFabrics.length}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Fabrics under 50m remaining</p>
                </div>
            </div>

            {/* Two-Column Activity View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-7 border border-border bg-card p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                            Recent Customer Orders
                        </h2>
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider gap-1">
                                View All <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {orders.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4">No recent orders found.</p>
                        ) : (
                            orders.map((order:any) => (
                                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-mono font-semibold">{order.orderNumber}</p>
                                        <p className="text-muted-foreground">
                                            {order.customerName} • {order.city}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-semibold">{formatPrice(order.totalAmount)}</p>
                                        <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      {order.paymentMethod} ({order.status})
                    </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Inventory Stock Alerts */}
                <div className="lg:col-span-5 border border-border bg-card p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                            Low Stock Fabric Rolls
                        </h2>
                        <Link href="/admin/fabrics">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider gap-1">
                                Manage <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {fabrics.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4">No fabric inventory found.</p>
                        ) : (
                            fabrics.slice(0, 5).map((fabric:any) => (
                                <div key={fabric.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-medium">{fabric.name}</p>
                                        <p className="text-muted-foreground">{fabric.material}</p>
                                    </div>
                                    <div className="text-right">
                    <span
                        className={`font-mono font-semibold ${
                            fabric.stock < 50 ? "text-destructive" : "text-emerald-600"
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
            </div>
        </div>
    )
}