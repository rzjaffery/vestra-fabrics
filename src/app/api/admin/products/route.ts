import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(){
    try {
        const products = await prisma.product.findMany({
            orderBy: {createdAt: 'desc'},
        });
        return NextResponse.json(products);
    }catch(err){
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(req: Request){
    try {
        const body = await req.json()
        const { name, description, price, material, weight, width, stock, images, featured } = body

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                material,
                weight,
                width,
                stock: parseInt(stock),
                images: Array.isArray(images) ? images : [images],
                featured: Boolean(featured),
            },
        })
        return NextResponse.json({success: true, product})
    }catch(error: any){
        return NextResponse.json({ error: error.message || "Failed to create fabric" }, { status: 500 })
    }
}