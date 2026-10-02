import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const products = await prisma.readyMadeProduct.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(products)
    } catch (error: any) {
        console.error("Error fetching ready-made products:", error)
        return NextResponse.json(
            { error: "Failed to fetch ready-made products" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const price = parseFloat(body.price)
        const stock = parseInt(body.stock, 10)

        if (isNaN(price) || isNaN(stock)) {
            return NextResponse.json(
                { error: "Price and stock must be valid numbers" },
                { status: 400 }
            )
        }

        const product = await prisma.readyMadeProduct.create({
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

        return NextResponse.json({ product }, { status: 201 })
    } catch (error: any) {
        console.error("Ready-made creation error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create product" },
            { status: 500 }
        )
    }
}