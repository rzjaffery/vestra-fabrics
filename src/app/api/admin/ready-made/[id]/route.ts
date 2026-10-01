import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json()
        const product = await prisma.readyMadeProduct.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description || null,
                price: parseFloat(body.price),
                stock: parseInt(body.stock, 10),
                sizes: body.sizes || [],
                categoryId: body.categoryId || null,
                images: body.images || [],
                featured: Boolean(body.featured),
            },
            include: { category: true },
        })
        return NextResponse.json({ product })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.readyMadeProduct.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }
}