import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const products = await prisma.readyMadeProduct.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch ready-made products" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const product = await prisma.readyMadeProduct.create({
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
        return NextResponse.json({ product }, { status: 201 })
    } catch (error) {
        console.error("Ready-made creation error:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}