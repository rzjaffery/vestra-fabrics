import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import {
    ShoppingBag,
    TrendingUp,
    AlertTriangle,
    Layers,
    ArrowRight,
    Clock,
} from "lucide-react"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export const revalidate = 0

export default async function AdminDashboardOverview() {
    const [orders, products] = await Promise.all([
        prisma.order.findMany({
            take: 5,
            orderBy: {createdAt: "desc"},
        }),
        prisma.product.findMany({
            orderBy: {stock: "asc"},
        }),
    ])

    const totalRevenue = orders.reduce((sum: any, order: { totalAmount: any }) => sum + order.totalAmount, 0)
    const pendingOrders = orders.filter((o: { status: string }) => o.status === "PENDING").length
    const lowStockProducts = products.filter((p: { stock: number }) => p.stock < 50) // Fabric stock under 50 meters

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
                <div className="border border-border p-5 bg-card">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Total Sales</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500"/>
                    </div>
                    <p className="text-2xl font-semibold">{formatPrice(totalRevenue)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Gross order volume</p>
                </div>

                <div className="border border-border p-5 bg-card">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Pending Orders</span>
                        <Clock className="h-4 w-4 text-amber-500"/>
                    </div>
                    <p className="text-2xl font-semibold">{pendingOrders}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Awaiting verification</p>
                </div>

                <div className="border border-border p-5 bg-card">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Active Fabrics</span>
                        <Layers className="h-4 w-4 text-blue-500"/>
                    </div>
                    <p className="text-2xl font-semibold">{products.length}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Listings in catalog</p>
                </div>

                <div className="border border-border p-5 bg-card">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider">Low Stock Warning</span>
                        <AlertTriangle className="h-4 w-4 text-destructive"/>
                    </div>
                    <p className="text-2xl font-semibold text-destructive">{lowStockProducts.length}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Fabrics under 50m remaining</p>
                </div>
            </div>

            {/* Two-Column Activity View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-7 border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                            Recent Customer Orders
                        </h2>
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider gap-1">
                                View All <ArrowRight className="h-3 w-3"/>
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {orders.map((order: { id: Key | null | undefined; orderNumber: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; customerName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; city: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; totalAmount: number; paymentMethod: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                            <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-mono font-semibold">{order.orderNumber}</p>
                                    <p className="text-muted-foreground">{order.customerName} • {order.city}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-semibold">{formatPrice(order.totalAmount)}</p>
                                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                    {order.paymentMethod} ({order.status})
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Stock Alerts */}
                <div className="lg:col-span-5 border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="text-sm font-mono uppercase tracking-wider font-semibold">
                            Low Stock Fabric Rolls
                        </h2>
                        <Link href="/admin/products">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider gap-1">
                                Manage <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {products.slice(0, 5).map((product: any) => (
                            <div key={product.id} className="py-3 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-muted-foreground">{product.material}</p>
                                </div>
                                <div className="text-right">
                  <span
                      className={`font-mono font-semibold ${
                          product.stock < 50 ? "text-destructive" : "text-emerald-600"
                      }`}
                  >
                    {product.stock} remaining
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}