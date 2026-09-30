import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {
            customerName,
            customerEmail,
            phone,
            address,
            city,
            postalCode,
            paymentMethod = "COD",
            items,
            notes,
        } = body

        // 1. Validation checks
        if (!customerName || !customerEmail || !phone || !address || !city) {
            return NextResponse.json(
                { error: "Please fill in all required customer details." },
                { status: 400 }
            )
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty. Cannot create order." },
                { status: 400 }
            )
        }

        // 2. Calculate numeric total amount (e.g. 8000 * 3 = 24000)
        const calculatedTotal = items.reduce((sum: number, item: any) => {
            const itemPrice = typeof item.price === "number" ? item.price : (item.product?.price || 0)
            const qty = parseInt(item.quantity, 10) || 1
            return sum + itemPrice * qty
        }, 0)

        // 3. Format line items for Prisma OrderItem relation
        const formattedItems = items.map((item: any) => ({
            productId: item.productId || item.product?.id || item.id,
            quantity: parseInt(item.quantity, 10) || 1,
            price: parseFloat(item.price || item.product?.price || 0),
        }))

        // 4. Determine initial order and payment statuses
        const orderNumber = `VES-${Math.floor(100000 + Math.random() * 900000)}`
        let paymentStatus = "Pending"

        if (paymentMethod === "COD") {
            paymentStatus = "Pending COD"
        } else if (paymentMethod === "BANK_TRANSFER") {
            paymentStatus = "Awaiting Verification"
        }

        // 5. Create Order in Prisma
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
                status: "PENDING",
                totalAmount: calculatedTotal, // Correctly passing numeric Float
                notes: notes || "",
                items: {
                    create: formattedItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        return NextResponse.json({ success: true, order }, { status: 201 })
    } catch (error: any) {
        console.error("Order Creation Error:", error)
        return NextResponse.json(
            { error: error?.message || "Failed to create order" },
            { status: 500 }
        )
    }
}