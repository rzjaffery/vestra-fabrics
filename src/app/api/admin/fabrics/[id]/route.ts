import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json()
        const fabric = await prisma.fabric.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description || null,
                price: parseFloat(body.price),
                stock: parseFloat(body.stock),
                material: body.material || null,
                width: body.width || null,
                weight: body.weight || null,
                images: body.images || [],
                featured: Boolean(body.featured),
            },
        })
        return NextResponse.json({ fabric })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update fabric" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.fabric.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete fabric" }, { status: 500 })
    }
}