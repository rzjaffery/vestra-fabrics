import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ChevronLeftIcon, RefreshCw, ShieldCheck, Truck} from "lucide-react";
import Image from "next/image";
import {Button} from "@/components/ui/button";

interface ProductPageProps {
    params:Promise<{
        slug: string;
    }>
}
export async function GenerateMetaData({params}: ProductPageProps){
    const {slug} = await params
    const product = await prisma.product.findUnique({
        where: { slug },
    })

    if (!product) {
        return {
            title: 'Product not found | Vestra Fabrics',
        }
    }
    return {
        title: `${product.title} | Vestra Fabrics | Vestra`,
        description: product.description
    }
}
export default async function ProductDetailPage({params}: ProductPageProps){
    const {slug} = await params
    const product = await prisma.product.findUnique({where: {slug}})
    if (!product) {notFound()}

    return (
        <div className='container mx-auto px-4 py-8 md:py-8'>
            <Link
                href='/shop'
                className='inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8'>
                <ChevronLeftIcon className='h-4 w-4'/>
                Back to collection
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Product Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted border">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Product Details & Purchase Panel */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                                {product.material}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight mt-1">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-semibold mt-4">
                                ${product.price.toFixed(2)}{" "}
                                <span className="text-sm font-normal text-muted-foreground">/ meter</span>
                            </p>
                        </div>

                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                            {product.description}
                        </p>

                        {/* Spec Highlights Grid */}
                        <div className="grid grid-cols-3 gap-4 border-y py-4 text-center">
                            <div>
                                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Weight</p>
                                <p className="text-sm font-medium mt-1">{product.weight}</p>
                            </div>
                            <div className="border-x">
                                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Width</p>
                                <p className="text-sm font-medium mt-1">{product.width}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Availability</p>
                                <p className="text-sm font-medium mt-1">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                            </div>
                        </div>

                        {/* Temporary Placeholder Button */}
                        <Button size="lg" className="w-full rounded-none tracking-wider uppercase text-xs h-12">
                            Add to Fabric Cart
                        </Button>
                    </div>

                    {/* Luxury Guarantees */}
                    <div className="grid grid-cols-3 gap-2 pt-8 border-t text-muted-foreground text-[11px] mt-8">
                        <div className="flex flex-col items-center text-center gap-1">
                            <Truck className="h-4 w-4" />
                            <span>Worldwide Shipping</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Certified Mill Quality</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1">
                            <RefreshCw className="h-4 w-4" />
                            <span>Sample Swatches Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}