import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()

        const updateData: any = {}

        if (body.name !== undefined) updateData.name = body.name
        if (body.price !== undefined) updateData.price = parseFloat(body.price)
        if (body.stock !== undefined) updateData.stock = parseInt(body.stock, 10)
        if (body.material !== undefined) updateData.material = body.material
        if (body.weight !== undefined) updateData.weight = body.weight
        if (body.width !== undefined) updateData.width = body.width
        if (body.description !== undefined) updateData.description = body.description
        if (body.featured !== undefined) updateData.featured = Boolean(body.featured)

        if (body.images) {
            updateData.images = Array.isArray(body.images) ? body.images : [body.images]
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json({ success: true, product: updatedProduct })
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }
}