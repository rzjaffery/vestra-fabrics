import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Helper to extract clean candidate IDs from cart items
function getItemCandidateIds(item: any): string[] {
    const ids: string[] = []

    if (item.fabricId) ids.push(String(item.fabricId))
    if (item.readyMadeProductId) ids.push(String(item.readyMadeProductId))
    if (item.productId) ids.push(String(item.productId))

    if (item.id) {
        const idStr = String(item.id)
        ids.push(idStr)

        // Handles composite keys like "cm12345-M" or "fabric_cm12345"
        if (idStr.includes("-")) {
            ids.push(idStr.split("-")[0])
        }
        if (idStr.includes("_")) {
            ids.push(idStr.split("_")[0])
            ids.push(idStr.split("_").pop()!)
        }
    }

    return Array.from(new Set(ids.filter(Boolean)))
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {
            customerName,
            customerEmail,
            email,
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

        // 1. Collect all potential DB candidate IDs across all cart items
        const allCandidateIds = items.flatMap(getItemCandidateIds)

        // 2. Query DB concurrently for matching records
        const [existingFabrics, existingReadyMade] = await Promise.all([
            allCandidateIds.length > 0
                ? prisma.fabric.findMany({
                    where: { id: { in: allCandidateIds } },
                    select: { id: true, price: true, name: true },
                })
                : [],
            allCandidateIds.length > 0
                ? prisma.readyMadeProduct.findMany({
                    where: { id: { in: allCandidateIds } },
                    select: { id: true, price: true, name: true },
                })
                : [],
        ])

        const fabricMap = new Map(existingFabrics.map((f:any) => [f.id, f]))
        const readyMadeMap = new Map(existingReadyMade.map((r:any) => [r.id, r]))

        // 3. Map order items using verified database records
        const orderItemsData = []

        for (const item of items) {
            const candidateIds = getItemCandidateIds(item)
            const itemType = (item.itemType || item.type || "").toUpperCase()

            let fabricId: string | null = null
            let readyMadeProductId: string | null = null
            let verifiedPrice: number = Number(item.price)

            const foundFabricId = candidateIds.find((id) => fabricMap.has(id))
            const foundReadyMadeId = candidateIds.find((id) => readyMadeMap.has(id))

            if ((itemType === "FABRIC" || item.fabricId) && foundFabricId) {
                fabricId = foundFabricId
                verifiedPrice = (fabricMap.get(foundFabricId) as { price: number })!.price
            } else if ((itemType === "READY_MADE" || item.readyMadeProductId) && foundReadyMadeId) {
                readyMadeProductId = foundReadyMadeId
                verifiedPrice = (readyMadeMap.get(foundReadyMadeId) as { price: number })!.price
            } else if (foundFabricId) {
                fabricId = foundFabricId
                verifiedPrice = (fabricMap.get(foundFabricId) as { price: number })!.price
            } else if (foundReadyMadeId) {
                readyMadeProductId = foundReadyMadeId
                verifiedPrice = (readyMadeMap.get(foundReadyMadeId) as { price: number })!.price
            }

            // Unlinked item fallback check
            if (!fabricId && !readyMadeProductId) {
                console.error("Order creation failed for item:", item, "Candidates tested:", candidateIds)
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "One or more items in your cart no longer exist in the store database. Please clear your cart and re-add the product.",
                    },
                    { status: 400 }
                )
            }

            const isFabric = Boolean(fabricId)
            const quantity = isFabric
                ? Number(item.meters || item.quantity || 1)
                : Number(item.quantity || 1)

            orderItemsData.push({
                fabricId,
                readyMadeProductId,
                quantity,
                price: verifiedPrice,
                selectedSize: item.selectedSize || item.size || null,
            })
        }

        // 4. Calculate verified subtotal and shipping
        const subtotal = orderItemsData.reduce((acc, item) => acc + item.price * item.quantity, 0)
        const shippingFee = city?.trim().toLowerCase() === "karachi" ? 250 : 350
        const totalAmount = subtotal + shippingFee

        // 5. Generate Order Metadata
        const orderNumber = `VES-${Math.floor(100000 + Math.random() * 900000)}`
        const paymentStatus = paymentMethod === "COD" ? "Pending" : "Awaiting Verification"
        const finalEmail = customerEmail || email || ""

        // 6. Create Order in Database
        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerName,
                customerEmail: finalEmail,
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