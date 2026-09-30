import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()

        const { status, paymentStatus, notes } = body

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(paymentStatus && { paymentStatus }),
                ...(notes !== undefined && { notes }),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        return NextResponse.json({ success: true, order: updatedOrder })
    } catch (error: any) {
        console.error("Order update error:", error)
        return NextResponse.json(
            { status: 500 }
        )
    }
}