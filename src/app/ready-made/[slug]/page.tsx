// app/ready-made/[slug]/page.tsx
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReadyMadeDetailClient } from "./client-detail"

export const revalidate = 0

interface Props {
    params: Promise<{ slug: string }>
}

export default async function ReadyMadeDetailPage({ params }: Props) {
    const { slug } = await params

    const product = await prisma.readyMadeProduct.findFirst({
        where: {
            OR: [{ slug }, { id: slug }],
        },
    })

    if (!product) {
        notFound()
    }

    return <ReadyMadeDetailClient product={product} />
}