import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Await params to ensure compatibility with Next.js 15+
        const resolvedParams = await params
        const productId = resolvedParams.id

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is missing in route params" },
                { status: 400 }
            )
        }

        const body = await req.json()

        // Safely parse numeric values
        const price = parseFloat(body.price)
        const stock = parseInt(body.stock, 10)

        if (isNaN(price) || isNaN(stock)) {
            return NextResponse.json(
                { error: "Price and stock must be valid numbers" },
                { status: 400 }
            )
        }

        const product = await prisma.readyMadeProduct.update({
            where: { id: productId },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description || null,
                price: price,
                stock: stock,
                sizes: Array.isArray(body.sizes) ? body.sizes : [],
                categoryId: body.categoryId && body.categoryId !== "" ? body.categoryId : null,
                images: Array.isArray(body.images) ? body.images : [],
                featured: Boolean(body.featured),
            },
            include: { category: true },
        })

        return NextResponse.json({ product })
    } catch (error: any) {
        console.error("Error updating ready-made product:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update product" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await params
        const productId = resolvedParams.id

        await prisma.readyMadeProduct.delete({
            where: { id: productId },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Error deleting ready-made product:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete product" },
            { status: 500 }
        )
    }
}