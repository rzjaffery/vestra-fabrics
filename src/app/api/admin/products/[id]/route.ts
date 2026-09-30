import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function PATCH(
    req: Request,
    {params}:{params: Promise<{id:string}>}
){
    try {
        const {id} = await params
        const body = await req.json()

        const updatedProduct = await prisma.product.update({
            where: {id},
            data: {
                ...(body.name && { name: body.name }),
                ...(body.price && { price: parseFloat(body.price) }),
                ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
                ...(body.material && { material: body.material }),
                ...(body.weight && { weight: body.weight }),
                ...(body.width && { width: body.width }),
                ...(body.description && { description: body.description }),
                ...(body.images && { images: Array.isArray(body.images) ? body.images : [body.images] }),
            },
        })
        return NextResponse.json({success: true, product: updatedProduct})
    }catch (error: any){
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    {params}:{params:Promise<{id:string}>}
){
    try {
        const {id} = await params
        await prisma.product.delete({where: {id}})
        return NextResponse.json({success: true})
    }catch (error: any){
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

}