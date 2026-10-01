// app/ready-made/[slug]/page.tsx
import { notFound } from 'next/navigation'
import ReadyMadeDetailClient from './ReadyMadeDetailClient'

export interface ReadyMadeDetail {
    id: string
    slug: string
    name: string
    description: string
    category: string
    price: number
    fabricComposition: string
    fitDescription: string
    images: string[]
    careInstructions: string[]
    sizeVariants: {
        size: string
        inStock: number
    }[]
    sizeChart: {
        size: string
        bustInches: string
        waistInches: string
        hipInches: string
    }[]
}

// Fetching helper (replace with your Prisma or API query)
async function getReadyMadeBySlug(slug: string): Promise<ReadyMadeDetail | null> {
    const mockProducts: Record<string, ReadyMadeDetail> = {
        'tailored-linen-blazer': {
            id: 'rm1',
            slug: 'tailored-linen-blazer',
            name: 'Tailored Linen Blazer',
            description:
                'A sharp, relaxed single-breasted blazer constructed from 100% organic heavy linen. Features horn buttons, lightly padded shoulders, and notch lapels.',
            category: 'Jackets & Blazers',
            price: 145.0,
            fabricComposition: '100% French Flax Linen, Cupro Lining',
            fitDescription: 'Tailored fit; fits true to size. Take your normal size for a classic look or size up for an oversized silhouette.',
            images: [
                '/images/ready-made/linen-blazer-front.jpg',
                '/images/ready-made/linen-blazer-back.jpg',
                '/images/ready-made/linen-blazer-detail.jpg',
            ],
            careInstructions: [
                'Dry clean only',
                'Cool iron if needed',
                'Store on structured hanger',
            ],
            sizeVariants: [
                { size: 'XS', inStock: 3 },
                { size: 'S', inStock: 8 },
                { size: 'M', inStock: 12 },
                { size: 'L', inStock: 0 }, // Out of stock
                { size: 'XL', inStock: 5 },
            ],
            sizeChart: [
                { size: 'XS', bustInches: '32-33"', waistInches: '25-26"', hipInches: '35-36"' },
                { size: 'S', bustInches: '34-35"', waistInches: '27-28"', hipInches: '37-38"' },
                { size: 'M', bustInches: '36-37"', waistInches: '29-30"', hipInches: '39-40"' },
                { size: 'L', bustInches: '38-40"', waistInches: '31-33"', hipInches: '41-43"' },
                { size: 'XL', bustInches: '41-43"', waistInches: '34-36"', hipInches: '44-46"' },
            ],
        },
    }

    return mockProducts[slug] || null
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const product = await getReadyMadeBySlug(params.slug)
    if (!product) return { title: 'Product Not Found' }

    return {
        title: `${product.name} | Ready-to-Wear Collection`,
        description: `Shop ${product.name} ($${product.price.toFixed(2)}). Handcrafted ${product.category.toLowerCase()} made with premium materials.`,
    }
}

export default async function ReadyMadePage({ params }: { params: { slug: string } }) {
    const product = await getReadyMadeBySlug(params.slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 flex text-sm text-gray-500">
                <a href="/" className="hover:text-black">Home</a>
                <span className="mx-2">&gt;</span>
                <a href="/ready-made" className="hover:text-black">Ready to Wear</a>
                <span className="mx-2">&gt;</span>
                <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>

            <ReadyMadeDetailClient product={product} />
        </div>
    )
}