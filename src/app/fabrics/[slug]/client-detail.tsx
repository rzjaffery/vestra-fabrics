// app/fabrics/[slug]/client-detail.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/format-price"
import { ArrowLeft, Layers, Scissors, ShieldCheck } from "lucide-react"
import { AddToCartButton } from "@/components/store/add-to-cart-button"

export function FabricDetailClient({ fabric }: { fabric: any }) {
    const images =
        fabric.images && fabric.images.length > 0
            ? fabric.images
            : fabric.imageUrl
                ? [fabric.imageUrl]
                : ["/placeholder-fabric.jpg"]

    const [selectedImage, setSelectedImage] = useState(images[0])
    const [meters, setMeters] = useState<number>(2.5) // Default suit length

    const pricePerMeter = fabric.pricePerMeter ?? fabric.price ?? 0
    const totalPrice = pricePerMeter * meters
    const presetMeters = [1, 2, 2.5, 3, 5]

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back Link */}
            <div className="mb-6">
                <Link
                    href="/fabrics"
                    className="inline-flex items-center text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                    Back to Fabric Catalog
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Gallery */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden bg-muted border border-border rounded-lg">
                        <Image
                            src={selectedImage}
                            alt={fabric.name}
                            fill
                            priority
                            className="object-cover object-center"
                        />
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

                {/* Specifications & Purchasing Options */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                        <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Unstitched Fabric • {fabric.material || "Textile"}
              </span>
                            <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
                                {fabric.name}
                            </h1>
                            <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-semibold font-mono tracking-tight text-foreground">
                  {formatPrice(pricePerMeter)}
                </span>
                                <span className="text-xs text-muted-foreground font-mono">per meter</span>
                            </div>
                        </div>

                        {/* Spec Badges */}
                        <div className="grid grid-cols-2 gap-3 border-y border-border py-4 font-mono text-xs">
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span>
                  Weight: {fabric.weight || (fabric.weightGsm ? `${fabric.weightGsm} GSM` : "Standard")}
                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Scissors className="h-4 w-4 text-muted-foreground" />
                                <span>
                  Width: {fabric.width || (fabric.widthInches ? `${fabric.widthInches}"` : "Standard")}
                </span>
                            </div>
                        </div>

                        {/* Meterage Preset Selector */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">
                                    Select Length Preset
                                </label>
                                <span className="text-xs font-mono text-muted-foreground">
                  Stock: {fabric.stock || fabric.inStockMeters || 0}m available
                </span>
                            </div>

                            {/* Quick Preset Buttons */}
                            <div className="grid grid-cols-5 gap-2">
                                {presetMeters.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMeters(m)}
                                        className={`py-2 text-xs font-mono border transition-all ${
                                            meters === m
                                                ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                                                : "bg-card text-foreground border-border hover:border-foreground/60"
                                        }`}
                                    >
                                        {m}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Calculated Total Box */}
                        <div className="bg-muted/40 p-4 border border-border rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs font-mono text-muted-foreground uppercase">Calculated Total</p>
                                <p className="text-xs text-muted-foreground">
                                    {meters} meters @ {formatPrice(pricePerMeter)}/m
                                </p>
                            </div>
                            <p className="text-2xl font-bold font-mono text-foreground">
                                {formatPrice(totalPrice)}
                            </p>
                        </div>

                        {/* Add to Cart Component (using key to re-sync when presets change) */}
                        <AddToCartButton
                            key={meters}
                            initialQuantity={meters}
                            product={{
                                id: fabric.id,
                                name: fabric.name,
                                slug: fabric.slug || fabric.id,
                                price: pricePerMeter,
                                stock: fabric.stock || fabric.inStockMeters || 0,
                                imageUrl: images[0],
                                images: images,
                                itemType: "FABRIC",
                            }}
                        />
                    </div>

                    <div className="border-t border-border pt-6 text-xs text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span>Precision custom cutting service straight from mill rolls</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}