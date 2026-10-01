import {prisma} from "@/lib/prisma";
import {PackageCheck} from "lucide-react";
import {formatPrice} from "@/lib/format-price";
import {AdminOrderManager} from "@/components/admin/admin-order-manager";


export const revalidate = 0;

export default async function AdminOrdersPage(){
    const orders = await prisma.order.findMany({
        include: {
            items:{
                include: {
                    product: true
                },
            },
        },
        orderBy:{
            createdAt: "desc",
        }
    })
    const totalRevenue = orders.reduce((sum: any, order: { totalAmount: any; }) => sum + order.totalAmount, 0)
    const pendingOrders = orders.filter((o: { status: string; }) => o.status === "PENDING").length
    const processingOrders = orders.filter((o: { status: string; }) => o.status === "PROCESSING").length
    const shippedOrders = orders.filter((o: { status: string; }) => o.status === "SHIPPED").length

    return (
        <div className="container mx-auto px-4 py-10 max-w-7xl">
            <div className='flex flex-col md: flex-row md: items-center justify-between gap-4 mb-8'>
                <div>
                    <span className='text-xs font-mono uppercase tracking-widest text-muted-foreground'>
                        Store Management
                    </span>
                    <h1 className='text-3xl font-light tracking-tight text-foreground mt-1'>
                        Order Dashboard
                    </h1>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap 4 mb-8'>
                <div className='border border-border bg-card p-4'>
                    <div className='flex items-center justify-between text-muted-foreground mb-2'>
                        <span className="text-xs uppercase font-mono tracking-wider">Total Sales</span>
                        <PackageCheck className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-semibold">{formatPrice(totalRevenue)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{orders.length} total orders</p>
                </div>
                <div className='border border-border bg-card p-4'>
                    <div className='flex items-center justify-between text-muted-foreground mb-2'>
                        <span className="text-xs uppercase font-mono tracking-wider">Pending Orders</span>
                        <PackageCheck className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-semibold">{pendingOrders} orders</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{pendingOrders} awaiting confirmation</p>
                </div>
                <div className='border border-border bg-card p-4'>
                    <div className='flex items-center justify-between text-muted-foreground mb-2'>
                        <span className="text-xs uppercase font-mono tracking-wider">In Processing</span>
                        <PackageCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-semibold">{processingOrders} orders</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{processingOrders} orders in processing</p>
                </div>
                <div className='border border-border bg-card p-4'>
                    <div className='flex items-center justify-between text-muted-foreground mb-2'>
                        <span className="text-xs uppercase font-mono tracking-wider">Dispatched</span>
                        <PackageCheck className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-semibold">{shippedOrders} orders</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{shippedOrders} package handed to courier</p>
                </div>
            </div>
            <AdminOrderManager initialOrders={orders}/>
        </div>

    )
}
