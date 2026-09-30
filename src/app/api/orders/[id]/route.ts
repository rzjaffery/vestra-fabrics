import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()
        const { status, paymentStatus } = body

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(paymentStatus && { paymentStatus }),
            },
        })

        return NextResponse.json({ success: true, order: updatedOrder })
    } catch (error: any) {
        console.error("Order Update Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update order" },
            { status: 500 }
        )
    }
}