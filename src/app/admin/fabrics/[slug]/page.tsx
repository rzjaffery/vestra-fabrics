// app/fabrics/[slug]/page.tsx
import { notFound } from 'next/navigation'
import FabricDetailClient from './FabricDetailClient'

export interface FabricDetail {
    id: string
    slug: string
    name: string
    description: string
    material: string
    composition: string
    weightGsm: number
    widthInches: number
    pricePerMeter: number
    minMeters: number
    maxMetersPerOrder: number
    inStockMeters: number
    images: string[]
    careInstructions: string[]
    recommendedUses: string[]
}

// Helper to simulate DB query (Prisma / API)
async function getFabricBySlug(slug: string): Promise<FabricDetail | null> {
    // const fabric = await prisma.fabric.findUnique({ where: { slug } })
    const mockFabrics: Record<string, FabricDetail> = {
        'pure-mulberry-silk-charmeuse': {
            id: 'f1',
            slug: 'pure-mulberry-silk-charmeuse',
            name: 'Pure Mulberry Silk Charmeuse',
            description:
                'Luxuriously smooth with a rich satin luster on the front and a muted matte finish on the reverse. Highly fluid drape makes it ideal for bias-cut gowns, lingerie, and high-end linings.',
            material: 'Silk',
            composition: '100% Grade 6A Mulberry Silk',
            weightGsm: 80,
            widthInches: 54,
            pricePerMeter: 34.50,
            minMeters: 0.5,
            maxMetersPerOrder: 25,
            inStockMeters: 42.5,
            images: [
                '/images/fabrics/silk-charmeuse-1.jpg',
                '/images/fabrics/silk-charmeuse-2.jpg',
                '/images/fabrics/silk-charmeuse-drape.jpg',
            ],
            careInstructions: [
                'Dry clean recommended',
                'Hand wash cold with pH-neutral silk detergent',
                'Do not wring; lay flat to dry in shade',
                'Iron low heat on reverse side while damp',
            ],
            recommendedUses: ['Evening Gowns', 'Bridalwear', 'Camisoles', 'Pillowcases', 'Scarves'],
        },
    }

    return mockFabrics[slug] || null
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const fabric = await getFabricBySlug(params.slug)
    if (!fabric) return { title: 'Fabric Not Found' }

    return {
        title: `${fabric.name} | Fabric Store`,
        description: `Buy ${fabric.name} by the meter ($${fabric.pricePerMeter}/m). ${fabric.composition}, ${fabric.widthInches}" wide.`,
    }
}

export default async function FabricPage({ params }: { params: { slug: string } }) {
    const fabric = await getFabricBySlug(params.slug)

    if (!fabric) {
        notFound()
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex text-sm text-gray-500">
                <a href="/" className="hover:text-black">Home</a>
                <span className="mx-2">&gt;</span>
                <a href="/fabrics" className="hover:text-black">Fabrics</a>
                <span className="mx-2">&gt;</span>
                <span className="text-gray-900 font-medium">{fabric.name}</span>
            </nav>

            <FabricDetailClient fabric={fabric} />
        </div>
    )
}