// app/fabrics/page.tsx
import Link from 'next/link'
import Image from 'next/image'

interface FabricProduct {
    id: string
    slug: string
    name: string
    material: string // e.g., Silk, Linen, Cotton, Wool
    weightGsm: number
    widthInches: number
    pricePerMeter: number
    imageUrl: string
    inStockMeters: number
}

// Fetching helper (replace with your DB query or fetch call)
async function getFabrics(): Promise<FabricProduct[]> {
    // const fabrics = await prisma.fabric.findMany({ where: { isPublished: true } })
    return [
        {
            id: 'f1',
            slug: 'pure-mulberry-silk-charmeuse',
            name: 'Pure Mulberry Silk Charmeuse',
            material: '100% Silk',
            weightGsm: 80,
            widthInches: 54,
            pricePerMeter: 34.50,
            imageUrl: '/images/fabrics/silk-charmeuse.jpg',
            inStockMeters: 120,
        },
        {
            id: 'f2',
            slug: 'organic-washed-linen-natural',
            name: 'Organic Washed Linen',
            material: '100% Linen',
            weightGsm: 180,
            widthInches: 58,
            pricePerMeter: 22.00,
            imageUrl: '/images/fabrics/linen-natural.jpg',
            inStockMeters: 45,
        },
    ]
}

export default async function FabricsPage() {
    const fabrics = await getFabrics()

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Fabrics Collection</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Premium textiles sold by the meter. Perfect for custom tailoring and dressmaking.
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Sidebar Filters */}
                <aside className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Material</h3>
                        <div className="mt-3 space-y-2">
                            {['Silk', 'Linen', 'Cotton', 'Wool', 'Velvet'].map((mat) => (
                                <label key={mat} className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                                    <span className="ml-2">{mat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Min. Width</h3>
                        <div className="mt-3 space-y-2">
                            {['44" (112 cm)', '54" (137 cm)', '60" (152 cm)'].map((w) => (
                                <label key={w} className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                                    <span className="ml-2">{w}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Fabric Grid */}
                <main className="lg:col-span-3">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {fabrics.map((fabric) => (
                            <div key={fabric.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <div className="aspect-square w-full bg-gray-100 relative group-hover:opacity-90 transition">
                                    <Image
                                        src={fabric.imageUrl}
                                        alt={fabric.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    {fabric.material}
                  </span>
                                </div>

                                <div className="flex flex-1 flex-col p-4">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        <Link href={`/fabrics/${fabric.slug}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {fabric.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Width: {fabric.widthInches}&quot; &bull; {fabric.weightGsm} GSM
                                    </p>

                                    <div className="mt-auto pt-4 flex items-baseline justify-between">
                                        <div>
                                            <span className="text-lg font-bold text-gray-900">${fabric.pricePerMeter.toFixed(2)}</span>
                                            <span className="text-xs text-gray-500"> / meter</span>
                                        </div>
                                        <span className="text-xs text-emerald-600 font-medium">In Stock</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}