import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // Adjust path to your prisma instance

export async function GET() {
    try {
        const fabrics = await prisma.fabric.findMany({
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(fabrics)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch fabrics" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const fabric = await prisma.fabric.create({
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
        return NextResponse.json({ fabric }, { status: 201 })
    } catch (error) {
        console.error("Fabric creation error:", error)
        return NextResponse.json({ error: "Failed to create fabric" }, { status: 500 })
    }
}