import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json({ products })
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, description, price, material, weight, width, stock, images, featured } = body

        if (!name || price === undefined || stock === undefined) {
            return NextResponse.json(
                { error: "Name, price, and stock are required." },
                { status: 400 }
            )
        }

        const parsedPrice = parseFloat(price)
        const parsedStock = parseInt(stock, 10)

        if (isNaN(parsedPrice) || isNaN(parsedStock)) {
            return NextResponse.json(
                { error: "Price and stock must be valid numbers." },
                { status: 400 }
            )
        }

        // Generate unique slug
        const baseSlug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        const slug = `${baseSlug}-${Date.now()}`

        // Parse image array safely
        let imageArray: string[] = []
        if (Array.isArray(images)) {
            imageArray = images.filter((img) => typeof img === "string" && img.trim() !== "")
        } else if (typeof images === "string" && images.trim() !== "") {
            imageArray = [images.trim()]
        }

        if (imageArray.length === 0) {
            imageArray = [
                "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000&auto=format&fit=crop",
            ]
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description: description || null,
                price: parsedPrice,
                material: material || null,
                weight: weight || null,
                width: width || null,
                stock: parsedStock,
                images: imageArray,
                featured: Boolean(featured),
            },
        })

        return NextResponse.json({ success: true, product })
    } catch (error: any) {
        console.error("Prisma Create Error:", error)
        return NextResponse.json(
            { error: error?.message || "Failed to create fabric listing" },
            { status: 500 }
        )
    }
}