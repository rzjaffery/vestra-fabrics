// app/fabrics/[slug]/page.tsx
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FabricDetailClient } from "./client-detail"

export const revalidate = 0

interface Props {
    params: Promise<{ slug: string }>
}

export default async function FabricDetailPage({ params }: Props) {
    const { slug } = await params

    const fabric = await prisma.fabric.findFirst({
        where: {
            OR: [{ slug }, { id: slug }],
        },
    })

    if (!fabric) {
        notFound()
    }

    return <FabricDetailClient fabric={fabric} />
}