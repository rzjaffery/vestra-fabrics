import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request){
    try{
        const body = await req.json()
        const{
            customerName,
            customerEmail,
            phone,
            address,
            city,
            postalCode,
            paymentMethod,
            items,
            notes,
        } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
        }

        const totalAmount = items.reduce(
            (sum: number, item: any) => sum + item.product.price * item.quantity,
        )

        const orderNumber = `VES-${Math.floor(100000 + Math.random() * 900000)}`

        let paymentStatus = "Pending"
        if (paymentMethod === "COD") {
            paymentStatus = "Pending COD"
        } else if (paymentMethod === "BANK_TRANSFER") {
            paymentStatus = "Awaiting Verification"
        }

        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerName,
                customerEmail,
                phone,
                address,
                city,
                postalCode: postalCode || "",
                paymentMethod,
                paymentStatus,
                totalAmount,
                notes: notes || "",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        })
        return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: order.id })
    } catch (error: any) {
        console.error("Order Creation Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create order" },
            { status: 500 }
        )
    }
}