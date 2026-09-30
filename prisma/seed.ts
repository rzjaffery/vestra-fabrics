import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Clear existing products to avoid duplicates during re-seeding
    await prisma.product.deleteMany()

    const products = [
        {
            name: 'Belgian Washed Linen',
            slug: 'belgian-washed-linen',
            description: 'Ultra-soft, breathable natural Belgian flax linen with a distinctive textured drape. Ideal for timeless apparel and luxury interior drapery.',
            price: 4800,
            images: [
                'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=1000&auto=format&fit=crop'
            ],
            material: '100% Belgian Flax Linen',
            weight: '185 GSM',
            width: '150 cm',
            stock: 120,
            isFeatured: true,
        },
        {
            name: 'Raw Mulberry Silk Habotai',
            slug: 'raw-mulberry-silk-habotai',
            description: 'Luminous, pure grade-A Mulberry silk weave with a supple sheen and featherlight hand-feel.',
            price: 8500,
            images: [
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop'
            ],
            material: '100% Grade-A Mulberry Silk',
            weight: '70 GSM',
            width: '140 cm',
            stock: 45,
            isFeatured: true,
        },
        {
            name: 'Mongolian Cashmere Wool Blend',
            slug: 'mongolian-cashmere-wool-blend',
            description: 'Sublimely soft winter weave combining fine Mongolian cashmere with organic virgin wool.',
            price: 12000,
            images: [
                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop'
            ],
            material: '70% Virgin Wool, 30% Cashmere',
            weight: '340 GSM',
            width: '145 cm',
            stock: 30,
            isFeatured: true,
        },
        {
            name: 'Organic Giza Egyptian Cotton',
            slug: 'organic-giza-egyptian-cotton',
            description: 'Extra-long staple Egyptian cotton featuring exceptional tensile strength and silky softness.',
            price: 3600,
            images: [
                'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1000&auto=format&fit=crop'
            ],
            material: '100% Giza Egyptian Cotton',
            weight: '140 GSM',
            width: '160 cm',
            stock: 200,
            isFeatured: false,
        }
    ]

    for (const product of products) {
        const created = await prisma.product.create({
            data: product,
        })
        console.log(`Created product: ${created.name}`)
    }

    console.log('✅ Seeding finished successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })