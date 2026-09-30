import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const orderNumber = searchParams.get("orderNumber")?.trim()

        if (!orderNumber) {
            return NextResponse.json(
                { error: "Order number is required." },
                { status: 400 }
            )
        }

        const order = await prisma.order.findFirst({
            where: {
                orderNumber: {
                    equals: orderNumber,
                    mode: "insensitive",
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                material: true,
                                width: true,
                                images: true,
                            },
                        },
                    },
                },
            },
        })

        if (!order) {
            return NextResponse.json(
                { error: "Order not found. Please check your order reference number." },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, order })
    } catch (error: any) {
        console.error("Order tracking error:", error)
        return NextResponse.json(
            { error: "Failed to retrieve order status." },
            { status: 500 }
        )
    }
}