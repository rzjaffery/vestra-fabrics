"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
    Sparkles,
    ArrowRight,
    SlidersHorizontal,
    Plus,
    Check,
    Package,
    Eye,
    Layers,
    ChevronRight,
    ShieldCheck,
    Globe2,
    Maximize2,
    Trash2,
    ShoppingBag,
} from "lucide-react"

// --- TYPES & DATA ---
interface Fabric {
    id: string
    name: string
    category: "silk" | "linen" | "wool" | "cotton"
    weightGsm: number
    weave: string
    origin: string
    pricePerMeter: number
    description: string
    tagline: string
    accentGradient: string
    featured?: boolean
}

const HERO_FABRICS: Fabric[] = [
    {
        id: "fab-1",
        name: "Kyoto Mulberry Silk Dupioni",
        category: "silk",
        weightGsm: 110,
        weave: "Plain Weave with Slub",
        origin: "Kyoto, Japan",
        pricePerMeter: 145,
        tagline: "Crisp architectural volume with organic luster.",
        description: "Hand-reeled organic silk boasting structural body and iridescent light refraction. Ideal for haute couture silhouettes.",
        accentGradient: "from-amber-500/15 via-orange-500/5 to-transparent",
    },
    {
        id: "fab-2",
        name: "Flemish Rain-Retted Linen",
        category: "linen",
        weightGsm: 340,
        weave: "Heavy Basketweave",
        origin: "Kortrijk, Belgium",
        pricePerMeter: 98,
        tagline: "Earthy, substantial, and engineered to age gracefully.",
        description: "Cultivated along the Lys river. Natural pectin creates a heavy, sculptural drape for luxury interiors and tailored coats.",
        accentGradient: "from-stone-500/15 via-neutral-500/5 to-transparent",
    },
    {
        id: "fab-3",
        name: "Biella Super 160s Worsted",
        category: "wool",
        weightGsm: 260,
        weave: "2x2 Fine Twill",
        origin: "Biella, Italy",
        pricePerMeter: 185,
        tagline: "Fluid motion with high-definition wrinkle recovery.",
        description: "Woven from ultra-fine 15.5-micron merino fibers. Glacial water finishing grants an exceptionally soft hand-feel.",
        accentGradient: "from-blue-500/15 via-slate-500/5 to-transparent",
    },
]

const ALL_FABRICS: Fabric[] = [
    ...HERO_FABRICS,
    {
        id: "fab-4",
        name: "Nile Delta Giza 87 Satin",
        category: "cotton",
        weightGsm: 180,
        weave: "Fine Satin Twill",
        origin: "Nile Delta, Egypt",
        pricePerMeter: 82,
        tagline: "Luminous tension with cloud-like touch.",
        description: "Extra-long staple Egyptian cotton hand-harvested for uniform fiber strength and silky surface tension.",
        accentGradient: "from-emerald-500/15 via-teal-500/5 to-transparent",
    },
    {
        id: "fab-5",
        name: "Scottish Chevron Tweed",
        category: "wool",
        weightGsm: 420,
        weave: "Herringbone Twill",
        origin: "Hebrides, Scotland",
        pricePerMeter: 160,
        tagline: "Rugged structural depth for severe outerwear.",
        description: "Virgin wool spun with traditional dyes, capturing the tonal mist and heather of the Scottish Highlands.",
        accentGradient: "from-amber-700/15 via-yellow-600/5 to-transparent",
    },
    {
        id: "fab-6",
        name: "Raw Tussah Wild Silk",
        category: "silk",
        weightGsm: 210,
        weave: "Slubbed Slub Weave",
        origin: "Assam, India",
        pricePerMeter: 130,
        tagline: "Unrefined matte elegance with rich tactile variation.",
        description: "Harvested from wild silkworms, featuring natural gold-beige undertones and a rich textured grip.",
        accentGradient: "from-yellow-600/15 via-amber-500/5 to-transparent",
    },
]

export default function HomePage() {
    // --- STATES FOR INTERACTIVITY ---
    const [activeHeroId, setActiveHeroId] = useState<string>("fab-1")
    const [filterCategory, setFilterCategory] = useState<string>("all")
    const [maxWeight, setMaxWeight] = useState<number>(450)

    // Custom Swatch Kit Configurator State (Max 3 swatches)
    const [swatchKit, setSwatchKit] = useState<Fabric[]>([HERO_FABRICS[0]])

    const activeHeroFabric = HERO_FABRICS.find((f) => f.id === activeHeroId) || HERO_FABRICS[0]

    // Filtered Fabrics based on category and weight slider
    const filteredFabrics = ALL_FABRICS.filter((f) => {
        const matchesCategory = filterCategory === "all" || f.category === filterCategory
        const matchesWeight = f.weightGsm <= maxWeight
        return matchesCategory && matchesWeight
    })

    // Swatch box handlers
    const toggleSwatch = (fabric: Fabric) => {
        if (swatchKit.some((item) => item.id === fabric.id)) {
            setSwatchKit(swatchKit.filter((item) => item.id !== fabric.id))
        } else {
            if (swatchKit.length < 3) {
                setSwatchKit([...swatchKit, fabric])
            }
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">

            {/* ========================================== */}
            {/* 1. HERO SECTION WITH DYNAMIC FABRIC CANVAS  */}
            {/* ========================================== */}
            <section className="relative overflow-hidden border-b border-border pt-16 pb-20 md:pt-24 md:pb-32">
                {/* Dynamic ambient color glow based on selected fabric */}
                <div className={`absolute inset-0 bg-gradient-to-br ${activeHeroFabric.accentGradient} transition-all duration-700 -z-10`} />

                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left Content Column */}
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60 backdrop-blur-md text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>The Vestra Archive • 2026 Edition</span>
                            </div>

                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] mb-6">
                                Textiles engineered for <span className="italic font-serif font-normal">tactile permanence</span>.
                            </h1>

                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-light max-w-2xl mb-8">
                                Curating rare natural weaves from heritage mills worldwide. Precision natural fibers crafted for luxury bespoke fashion, architectural drapery, and high-end upholstery.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-all"
                                >
                                    <span>Explore Full Archive</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center gap-2 border border-border bg-background px-6 py-4 text-xs font-mono uppercase tracking-wider hover:border-foreground transition-all"
                                >
                                    <span>Our Heritage</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Interactive Fabric Card Switcher */}
                        <div className="lg:col-span-5">
                            <div className="border border-border bg-card/80 backdrop-blur-md p-6 md:p-8 relative shadow-2xl">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Interactive Preview
                  </span>
                                    <span className="text-xs font-mono text-muted-foreground">
                    {activeHeroFabric.origin}
                  </span>
                                </div>

                                <div className="space-y-4 mb-8">
                  <span className="inline-block px-2 py-0.5 bg-muted text-[10px] font-mono uppercase tracking-widest">
                    {activeHeroFabric.category}
                  </span>
                                    <h3 className="text-2xl font-light tracking-tight">{activeHeroFabric.name}</h3>
                                    <p className="text-sm text-muted-foreground italic font-serif">
                                        "{activeHeroFabric.tagline}"
                                    </p>
                                    <p className="text-xs text-foreground/80 leading-relaxed font-light pt-2">
                                        {activeHeroFabric.description}
                                    </p>
                                </div>

                                {/* Live Spec Bar */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border mb-6 text-xs font-mono">
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] uppercase">Weight</span>
                                        <span className="font-semibold">{activeHeroFabric.weightGsm} g/m²</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] uppercase">Weave Type</span>
                                        <span className="font-semibold">{activeHeroFabric.weave}</span>
                                    </div>
                                </div>

                                {/* Interactive Selector Buttons */}
                                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                    Switch Tactile Material:
                  </span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {HERO_FABRICS.map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => setActiveHeroId(f.id)}
                                                className={`p-2.5 text-[11px] font-mono text-left transition-all border ${
                                                    activeHeroId === f.id
                                                        ? "border-foreground bg-foreground text-background"
                                                        : "border-border bg-background hover:border-foreground/50 text-muted-foreground"
                                                }`}
                                            >
                                                <span className="block truncate font-medium">{f.name.split(" ")[0]}</span>
                                                <span className="text-[9px] opacity-70 block">{f.weightGsm}g</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 2. STATS & ARCHIVE INDEX                   */}
            {/* ========================================== */}
            <section className="border-b border-border bg-muted/20">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border border-x border-border">
                        <div className="p-6 md:p-8">
                            <span className="text-2xl md:text-3xl font-light font-mono block mb-1">100%</span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Traceable Natural Fibers</span>
                        </div>
                        <div className="p-6 md:p-8">
                            <span className="text-2xl md:text-3xl font-light font-mono block mb-1">48+</span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Artisan Mill Partners</span>
                        </div>
                        <div className="p-6 md:p-8">
                            <span className="text-2xl md:text-3xl font-light font-mono block mb-1">OEKO-TEX</span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Certified Chemical-Free</span>
                        </div>
                        <div className="p-6 md:p-8">
                            <span className="text-2xl md:text-3xl font-light font-mono block mb-1">Worldwide</span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Express Climate Delivery</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 3. INTERACTIVE ARCHIVE EXPLORER & FILTERS  */}
            {/* ========================================== */}
            <section className="py-20 border-b border-border">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                Real-Time Filtering
              </span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                                The Tactile Archive Matrix
                            </h2>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-md leading-relaxed font-mono uppercase tracking-wider">
                            Filter by fiber category or adjust structural density (g/m²) to discover precise specs.
                        </p>
                    </div>

                    {/* Interactive Filter Bar */}
                    <div className="p-6 border border-border bg-card mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                            {/* Category Buttons */}
                            <div className="md:col-span-7 flex flex-wrap gap-2">
                                {["all", "silk", "linen", "wool", "cotton"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
                                            filterCategory === cat
                                                ? "bg-foreground text-background border-foreground"
                                                : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Weight Slider */}
                            <div className="md:col-span-5 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Max Density:
                  </span>
                                    <span className="font-semibold">{maxWeight} g/m²</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="450"
                                    step="10"
                                    value={maxWeight}
                                    onChange={(e) => setMaxWeight(Number(e.target.value))}
                                    className="w-full accent-foreground cursor-pointer"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFabrics.map((fabric) => {
                            const isInSwatchKit = swatchKit.some((item) => item.id === fabric.id)

                            return (
                                <div
                                    key={fabric.id}
                                    className="border border-border bg-card p-6 flex flex-col justify-between transition-all hover:border-foreground/50 group"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5">
                        {fabric.origin}
                      </span>
                                            <span className="text-sm font-mono font-medium">${fabric.pricePerMeter}/m</span>
                                        </div>

                                        <h3 className="text-xl font-light group-hover:underline mb-2">{fabric.name}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-6 font-light">
                                            {fabric.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                                        <div className="text-[10px] font-mono text-muted-foreground">
                                            <span>{fabric.weightGsm} GSM</span> • <span>{fabric.weave}</span>
                                        </div>

                                        <button
                                            onClick={() => toggleSwatch(fabric)}
                                            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 border ${
                                                isInSwatchKit
                                                    ? "bg-emerald-600 text-white border-emerald-600"
                                                    : "bg-background text-foreground border-border hover:border-foreground"
                                            }`}
                                        >
                                            {isInSwatchKit ? (
                                                <>
                                                    <Check className="w-3 h-3" />
                                                    <span>Added</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-3 h-3" />
                                                    <span>Swatch</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </section>

            {/* ========================================== */}
            {/* 4. INTERACTIVE BUILDER: BESPOKE SWATCH BOX */}
            {/* ========================================== */}
            <section className="py-20 border-b border-border bg-muted/10">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="border border-border bg-background p-8 md:p-12">

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                            <div className="lg:col-span-6">
                                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                                    <Package className="w-4 h-4 text-amber-500" />
                                    <span>Custom Experience</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                                    Assemble Your Tactile Swatch Kit
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed font-light mb-6">
                                    Select up to 3 physical swatches directly from our matrix above to test drape, sheen, and hand-feel prior to placing a full bolt order.
                                </p>

                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>Includes complimentary international shipping & archive book.</span>
                                </div>
                            </div>

                            {/* Swatch Box Display */}
                            <div className="lg:col-span-6">
                                <div className="border border-border bg-card p-6">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <span className="text-xs font-mono uppercase tracking-widest">
                      Your Sample Box ({swatchKit.length}/3)
                    </span>
                                        <span className="text-xs font-mono text-muted-foreground">
                      {swatchKit.length === 3 ? "Kit Complete" : "Select from catalog"}
                    </span>
                                    </div>

                                    {/* Selected Slots */}
                                    <div className="space-y-3 mb-6">
                                        {[0, 1, 2].map((index) => {
                                            const item = swatchKit[index]

                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-3 border flex items-center justify-between text-xs font-mono transition-all ${
                                                        item ? "border-foreground bg-background" : "border-dashed border-border text-muted-foreground"
                                                    }`}
                                                >
                                                    {item ? (
                                                        <>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold text-foreground">0{index + 1}.</span>
                                                                <div>
                                                                    <p className="font-medium text-foreground">{item.name}</p>
                                                                    <span className="text-[10px] text-muted-foreground">{item.origin} • {item.weightGsm}g</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleSwatch(item)}
                                                                className="text-muted-foreground hover:text-foreground"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="italic text-muted-foreground/60">
                              Slot 0{index + 1}: Empty (Click + Swatch above)
                            </span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Checkout Swatch Action */}
                                    <Link
                                        href="/shop"
                                        className={`w-full py-3 text-center text-xs font-mono uppercase tracking-wider block transition-all ${
                                            swatchKit.length > 0
                                                ? "bg-foreground text-background hover:opacity-90"
                                                : "bg-muted text-muted-foreground pointer-events-none"
                                        }`}
                                    >
                                        {swatchKit.length > 0 ? `Order Sample Box (${swatchKit.length} Items)` : "Select Fabrics to Order"}
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 5. EDITORIAL BRAND VALUES BANNER          */}
            {/* ========================================== */}
            <section className="py-20 border-b border-border">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 border border-border bg-card">
                            <Globe2 className="w-6 h-6 mb-4 text-foreground" />
                            <h3 className="text-lg font-light mb-2">Direct-from-Mill Sourcing</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                We eliminate middle distributors, establishing direct relationships with century-old family mills in Japan, Belgium, Scotland, and Italy.
                            </p>
                        </div>

                        <div className="p-8 border border-border bg-card">
                            <Layers className="w-6 h-6 mb-4 text-foreground" />
                            <h3 className="text-lg font-light mb-2">Precision Material Testing</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                Every bolt undergoes rigorous tensile testing, weight verification, and light fastness inspection before entering our archive.
                            </p>
                        </div>

                        <div className="p-8 border border-border bg-card">
                            <ShoppingBag className="w-6 h-6 mb-4 text-foreground" />
                            <h3 className="text-lg font-light mb-2">Bespoke & Trade Accounts</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                Tailored solutions for couture ateliers, fashion houses, and interior architects requiring custom bolt lengths or private archiving.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 6. CALL TO ACTION                          */}
            {/* ========================================== */}
            <section className="py-24 bg-foreground text-background">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
          <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-4">
            Curated Supply
          </span>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight max-w-2xl mx-auto mb-6">
                        Begin your next creation with uncompromised materials.
                    </h2>
                    <p className="text-background/70 text-sm max-w-md mx-auto mb-8 font-light">
                        Browse our complete live collection or request direct consultation with a textile specialist.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/shop"
                            className="px-8 py-4 bg-background text-foreground text-xs font-mono uppercase tracking-wider hover:bg-background/90 transition-all"
                        >
                            Enter The Shop
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}