// app/ready-made/[slug]/client-detail.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/format-price"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react"
import { AddToCartButton } from "@/components/store/add-to-cart-button"

export function ReadyMadeDetailClient({ product }: { product: any }) {
    const images =
        product.images && product.images.length > 0
            ? product.images
            : product.imageUrl
                ? [product.imageUrl]
                : ["/placeholder-product.jpg"]

    const [selectedImage, setSelectedImage] = useState(images[0])
    const [selectedSize, setSelectedSize] = useState<string>("M")

    const sizes = ["XS", "S", "M", "L", "XL", "Custom"]

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back Link */}
            <div className="mb-6">
                <Link
                    href="/ready-made"
                    className="inline-flex items-center text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                    Back to Ready Made Collection
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Gallery */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-muted border border-border rounded-lg">
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        {product.stock <= 0 && (
                            <div className="absolute top-4 left-4">
                                <Badge variant="destructive" className="font-mono text-xs uppercase">
                                    Out of Stock
                                </Badge>
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="grid grid-cols-5 gap-3">
                            {images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative aspect-square overflow-hidden bg-muted border transition-all rounded ${
                                        selectedImage === img
                                            ? "border-foreground ring-1 ring-foreground"
                                            : "border-border hover:border-foreground/50 opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <Image src={img} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details & Options */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                        <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {product.category || "Ready To Wear"}
              </span>
                            <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-semibold font-mono tracking-tight text-foreground mt-3">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {product.description ||
                                "Elegantly designed pre-stitched ensemble crafted with fine tailoring and attention to detail. Designed for comfort, fit, and timeless sophistication."}
                        </p>

                        {/* Size Picker */}
                        <div className="space-y-3 border-t border-border pt-6">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">
                                    Select Size
                                </label>
                                <span className="text-xs text-muted-foreground font-mono">Size Guide</span>
                            </div>

                            <div className="grid grid-cols-6 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-2.5 text-xs font-mono border transition-all rounded-none ${
                                            selectedSize === size
                                                ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                                                : "bg-card text-foreground border-border hover:border-foreground/60"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector & Add to Cart Action */}
                        <AddToCartButton
                            product={{
                                id: product.id,
                                name: product.name,
                                slug: product.slug || product.id,
                                price: product.price,
                                stock: product.stock,
                                images: images,
                                itemType: "READY_MADE",
                            }}
                            selectedSize={selectedSize}
                        />
                    </div>

                    {/* Service Perks */}
                    <div className="border-t border-border pt-6 space-y-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <Truck className="h-4 w-4 text-primary" />
                            <span>Complimentary nationwide shipping on orders above PKR 10,000</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span>Guaranteed authentic quality & premium stitching</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <RefreshCw className="h-4 w-4 text-primary" />
                            <span>7-day easy size exchange policy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}