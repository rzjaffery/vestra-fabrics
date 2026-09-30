import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get("orderNumber")

    if (!orderNumber) {
        return NextResponse.json({ error: "Order number is required" }, { status: 400 })
    }

    try {
        const order = await prisma.order.findUnique({
            where: { orderNumber: orderNumber.trim().toUpperCase() },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        return NextResponse.json({ order })
    } catch (error: any) {
        return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }
}