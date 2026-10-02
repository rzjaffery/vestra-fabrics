import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Await params to ensure compatibility with Next.js 15+
        const resolvedParams = await params
        const fabricId = resolvedParams.id

        if (!fabricId) {
            return NextResponse.json(
                { error: "Fabric ID is missing in route params" },
                { status: 400 }
            )
        }

        const body = await req.json()

        // Safely parse numeric values to avoid NaN errors
        const price = parseFloat(body.price)
        const stock = parseFloat(body.stock)

        if (isNaN(price) || isNaN(stock)) {
            return NextResponse.json(
                { error: "Price and stock must be valid numbers" },
                { status: 400 }
            )
        }

        // Use lowercase 'prisma.fabric' to access the model
        const fabric = await prisma.fabric.update({
            where: { id: fabricId },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description || null,
                price: price,
                stock: stock,
                material: body.material || null,
                width: body.width || null,
                weight: body.weight || null,
                images: Array.isArray(body.images) ? body.images : [],
                featured: Boolean(body.featured),
            },
        })

        return NextResponse.json({ fabric })
    } catch (error: any) {
        console.error("Error updating fabric:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update fabric" },
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
        const fabricId = resolvedParams.id

        await prisma.fabric.delete({
            where: { id: fabricId }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Error deleting fabric:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete fabric" },
            { status: 500 }
        )
    }
}