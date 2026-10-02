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
            paymentMethod,
            notes,
            items,
        } = body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: "Cart is empty or invalid" },
                { status: 400 }
            )
        }

        // 1. Collect candidate IDs from cart items
        const candidateFabricIds = items
            .map((i: any) => i.fabricId || i.id || i.productId)
            .filter(Boolean)

        const candidateReadyMadeIds = items
            .map((i: any) => i.readyMadeProductId || i.id || i.productId)
            .filter(Boolean)

        // 2. Query DB to verify existing records
        const existingFabrics =
            candidateFabricIds.length > 0
                ? await prisma.fabric.findMany({
                    where: { id: { in: candidateFabricIds } },
                    select: { id: true },
                })
                : []

        const existingReadyMade =
            candidateReadyMadeIds.length > 0
                ? await prisma.readyMadeProduct.findMany({
                    where: { id: { in: candidateReadyMadeIds } },
                    select: { id: true },
                })
                : []

        const validFabricIds = new Set(existingFabrics.map((f:any) => f.id))
        const validReadyMadeIds = new Set(existingReadyMade.map((r:any) => r.id))

        // 3. Map order items cleanly based on existing DB IDs
        const orderItemsData = items.map((item: any) => {
            const candidateId = item.fabricId || item.readyMadeProductId || item.id || item.productId

            let fabricId: string | null = null
            let readyMadeProductId: string | null = null

            if (validFabricIds.has(candidateId)) {
                fabricId = candidateId
            } else if (validReadyMadeIds.has(candidateId)) {
                readyMadeProductId = candidateId
            }

            const isFabric = Boolean(fabricId) || item.itemType === "FABRIC"
            const quantity = isFabric
                ? Number(item.meters || item.quantity || 1)
                : Number(item.quantity || 1)

            return {
                fabricId,
                readyMadeProductId,
                quantity,
                price: Number(item.price),
                selectedSize: item.selectedSize || null,
            }
        })

        // Check if any items could not be linked to either table
        const unlinkedItem = orderItemsData.find(
            (item) => !item.fabricId && !item.readyMadeProductId
        )

        if (unlinkedItem) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "One or more items in your cart no longer exist in the store database. Please clear your cart and re-add the product.",
                },
                { status: 400 }
            )
        }

        // 4. Calculate subtotal and shipping
        const subtotal = items.reduce((acc: number, item: any) => {
            const qty = item.meters || item.quantity || 1
            return acc + item.price * qty
        }, 0)

        const shippingFee = city?.toLowerCase() === "karachi" ? 250 : 350
        const totalAmount = subtotal + shippingFee

        // 5. Generate Order Number
        const orderNumber = `VES-${Math.floor(100000 + Math.random() * 900000)}`

        // 6. Set Payment Status
        const paymentStatus =
            paymentMethod === "COD" ? "Pending" : "Awaiting Verification"

        // 7. Create Order in Prisma
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
                totalAmount,
                notes: notes || "",
                items: {
                    create: orderItemsData,
                },
            },
            include: {
                items: {
                    include: {
                        fabric: true,
                        readyMadeProduct: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            orderNumber: order.orderNumber,
            order,
        })
    } catch (error: any) {
        console.error("Order Creation Error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create order" },
            { status: 500 }
        )
    }
}