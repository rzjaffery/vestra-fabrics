"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
    Sparkles,
    Feather,
    Globe,
    ShieldCheck,
    ArrowRight,
    Layers,
    Compass,
    CheckCircle2,
    SlidersHorizontal,
    ChevronRight,
    Eye,
} from "lucide-react"

// --- TYPES & DATA ---
interface FabricSpec {
    id: string
    name: string
    tagline: string
    origin: string
    weight: string
    weaveType: string
    idealFor: string
    description: string
    accentColor: string
}

const FABRIC_SPECTRUM: FabricSpec[] = [
    {
        id: "silk",
        name: "Mulberry Silk Dupioni",
        tagline: "Unrivaled luster with structured slub textures",
        origin: "Kyoto, Japan",
        weight: "110 g/m²",
        weaveType: "Plain Weave with Slub",
        idealFor: "Eveningwear, Bespoke Couture & Structured Outerwear",
        description:
            "Hand-reeled organic mulberry silk sourced from heritage mills in Kyoto. Naturally crisp body with subtle texture variation that catches direct light with high-contrast elegance.",
        accentColor: "from-amber-500/20 to-orange-500/10",
    },
    {
        id: "linen",
        name: "Heavy Flemish Linen",
        tagline: "Earthy, breathable, and gracefully aging",
        origin: "Kortrijk, Belgium",
        weight: "340 g/m²",
        weaveType: "Hopsack / Basketweave",
        idealFor: "Architectural Drapery, Luxury Upholstery & Tailored Suits",
        description:
            "Cultivated along the Lys river using traditional rain-retting processes. Unbleached, rich in natural pectin, and engineered to soften and gain depth over decades of use.",
        accentColor: "from-stone-500/20 to-neutral-500/10",
    },
    {
        id: "wool",
        name: "Super 160s Merino Worsted",
        tagline: "Ultra-fine fluid drape with natural elasticity",
        origin: "Biella, Italy",
        weight: "260 g/m²",
        weaveType: "2x2 Twill",
        idealFor: "Four-Season Tailored Suits & Precision Outerwear",
        description:
            "Spun from 15.5-micron merino wool fibers. Treated with glacial water streams in Biella to achieve an impossibly soft hand-feel with dynamic wrinkle recovery.",
        accentColor: "from-blue-500/20 to-slate-500/10",
    },
    {
        id: "cotton",
        name: "Giza 87 Egyptian Twill",
        tagline: "Silky smoothness with high tensile durability",
        origin: "Nile Delta, Egypt",
        weight: "180 g/m²",
        weaveType: "Fine Satin Twill",
        idealFor: "Bespoke Shirting, Luxury Bedding & Delicate Linings",
        description:
            "Hand-harvested extra-long staple Egyptian cotton. Exceptional fiber uniformity creates a whisper-quiet drape and luminous surface tension that withstands hundreds of washes.",
        accentColor: "from-emerald-500/20 to-teal-500/10",
    },
]

const CRAFT_STEPS = [
    {
        num: "01",
        title: "Ethical Sourcing",
        summary: "Partnering exclusively with certified small-batch regenerative farms.",
        detail:
            "We source raw fibers only from certified regenerative agricultural mills across Europe, Asia, and Africa. Every batch is tracked from soil quality to harvest.",
    },
    {
        num: "02",
        title: "Artisan Spinning",
        summary: "Combining centuries-old looms with zero-waste precision technology.",
        detail:
            "Fibers are spun using vintage shuttle looms operated by master weavers alongside low-energy modern machinery, preserving historic tactile signatures.",
    },
    {
        num: "03",
        title: "Closed-Loop Dyeing",
        summary: "100% non-toxic, botanical, and recycled water dye processes.",
        detail:
            "All pigments are certified OEKO-TEX STANDARD 100 or derived from organic botanicals. Our closed-loop water treatment recycles 98% of process fluid.",
    },
    {
        num: "04",
        title: "Precision Archiving",
        summary: "Rigorously tested for structural integrity and tactile elegance.",
        detail:
            "Every bolt of cloth undergoes 14 distinct tension, friction, and color-fastness tests before receiving the official Vestra Archive Seal of Authenticity.",
    },
]

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<string>("silk")
    const [activeStep, setActiveStep] = useState<number>(0)

    // Interactive Fabric Recommender State
    const [useCase, setUseCase] = useState<"tailoring" | "drapery" | "upholstery">("tailoring")

    const selectedSpec = FABRIC_SPECTRUM.find((s) => s.id === activeTab) || FABRIC_SPECTRUM[0]

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
            {/* --- HERO SECTION --- */}
            <section className="relative overflow-hidden border-b border-border py-20 md:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background -z-10" />

                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>The Vestra Fabric Archive</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] max-w-4xl mb-8">
                        Woven for those who measure luxury in <span className="italic font-serif font-normal">tactile perfection</span>.
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                        <p className="md:col-span-7 text-muted-foreground text-base md:text-lg leading-relaxed font-light">
                            Founded at the intersection of heritage craftsmanship and spatial architecture,
                            Vestra curated the world’s most refined natural textile archive. We supply global couture
                            houses, master tailors, and luxury interior architects with traceable, uncompromised weaves.
                        </p>

                        <div className="md:col-span-5 flex flex-wrap gap-4 md:justify-end">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-all rounded-none"
                            >
                                <span>Explore the Collection</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS & METRICS --- */}
            <section className="border-b border-border bg-muted/20">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border border-x border-border">
                        <div className="p-6 md:p-8">
                            <p className="text-3xl md:text-4xl font-light font-mono tracking-tight mb-2">100%</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Traceable Origin</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-3xl md:text-4xl font-light font-mono tracking-tight mb-2">48+</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Artisan Mills</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-3xl md:text-4xl font-light font-mono tracking-tight mb-2">0%</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Synthetic Toxins</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-3xl md:text-4xl font-light font-mono tracking-tight mb-2">18,000m</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Archived Weaves</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INTERACTIVE FEATURE #1: TACTILE FABRIC SPECTRUM --- */}
            <section className="py-20 border-b border-border">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Interactive Index
            </span>
                        <h2 className="text-2xl md:text-4xl font-light tracking-tight mt-2">
                            The Tactile Spectrum
                        </h2>
                        <p className="text-muted-foreground text-sm max-w-xl mt-2">
                            Select a core material below to examine its structural composition, origin, and intended architectural purpose.
                        </p>
                    </div>

                    {/* Selector Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
                        {FABRIC_SPECTRUM.map((spec) => (
                            <button
                                key={spec.id}
                                onClick={() => setActiveTab(spec.id)}
                                className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                                    activeTab === spec.id
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                                }`}
                            >
                                {spec.name}
                            </button>
                        ))}
                    </div>

                    {/* Interactive Card Display */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* Visual Texture Card */}
                        <div className={`lg:col-span-5 border border-border p-8 flex flex-col justify-between bg-gradient-to-br ${selectedSpec.accentColor} relative overflow-hidden min-h-[320px]`}>
                            <div className="flex justify-between items-start">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Spec Specifier
                </span>
                                <Eye className="w-5 h-5 text-muted-foreground" />
                            </div>

                            <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                  Origin: {selectedSpec.origin}
                </span>
                                <h3 className="text-2xl md:text-3xl font-light">{selectedSpec.name}</h3>
                                <p className="text-sm text-muted-foreground mt-2 italic font-serif">
                                    "{selectedSpec.tagline}"
                                </p>
                            </div>

                            <div className="pt-6 border-t border-border/50 flex justify-between items-center text-xs font-mono">
                                <span>STRUCTURAL WEIGHT</span>
                                <span className="font-semibold">{selectedSpec.weight}</span>
                            </div>
                        </div>

                        {/* Spec Technical Details */}
                        <div className="lg:col-span-7 border border-border p-8 bg-card flex flex-col justify-between">
                            <div>
                                <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                                    Material Characteristics & Composition
                                </h4>
                                <p className="text-base text-foreground/90 leading-relaxed font-light mb-8">
                                    {selectedSpec.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border pt-6">
                                    <div>
                    <span className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                      Weave Architecture
                    </span>
                                        <p className="text-sm font-medium">{selectedSpec.weaveType}</p>
                                    </div>
                                    <div>
                    <span className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                      Ideal Application
                    </span>
                                        <p className="text-sm font-medium">{selectedSpec.idealFor}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border flex justify-end">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-foreground hover:underline"
                                >
                                    <span>View archived bolts in shop</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INTERACTIVE FEATURE #2: THE CRAFT TIMELINE --- */}
            <section className="py-20 border-b border-border bg-muted/10">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Methodology
            </span>
                        <h2 className="text-2xl md:text-4xl font-light tracking-tight mt-2">
                            From Raw Fiber to Finished Bolt
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            Explore the four immutable stages of our textile engineering process.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Step Selection Buttons */}
                        <div className="lg:col-span-5 space-y-3">
                            {CRAFT_STEPS.map((step, idx) => (
                                <button
                                    key={step.num}
                                    onClick={() => setActiveStep(idx)}
                                    className={`w-full text-left p-6 border transition-all flex items-start gap-4 ${
                                        activeStep === idx
                                            ? "bg-background border-foreground shadow-sm"
                                            : "bg-muted/30 border-border hover:border-foreground/30 text-muted-foreground"
                                    }`}
                                >
                  <span
                      className={`font-mono text-sm ${
                          activeStep === idx ? "text-foreground font-bold" : "text-muted-foreground"
                      }`}
                  >
                    {step.num}
                  </span>
                                    <div>
                                        <h3
                                            className={`text-base font-normal ${
                                                activeStep === idx ? "text-foreground" : "text-muted-foreground"
                                            }`}
                                        >
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                            {step.summary}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Active Step Detail Window */}
                        <div className="lg:col-span-7 border border-border bg-background p-8 md:p-12 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-8">
                  <span className="font-mono text-4xl font-light text-muted-foreground/40">
                    {CRAFT_STEPS[activeStep].num}
                  </span>
                                    <span className="px-3 py-1 bg-muted font-mono text-[10px] uppercase tracking-widest">
                    Phase {activeStep + 1} of 4
                  </span>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-light mb-4">
                                    {CRAFT_STEPS[activeStep].title}
                                </h3>

                                <p className="text-muted-foreground text-base leading-relaxed font-light mb-6">
                                    {CRAFT_STEPS[activeStep].detail}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-border flex items-center gap-3 text-xs font-mono text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Audited for environmental compliance and ethical labor standard.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INTERACTIVE FEATURE #3: BESPOKE FABRIC MATCHING TOOL --- */}
            <section className="py-20 border-b border-border">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="border border-border p-8 md:p-12 bg-card relative overflow-hidden">
                        <div className="max-w-xl mb-8">
                            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>Interactive Inquiry Assistant</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-light">
                                What are you currently creating?
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                Select your intended project type to get an instant textile recommendation from our archive.
                            </p>
                        </div>

                        {/* Selector Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <button
                                onClick={() => setUseCase("tailoring")}
                                className={`p-4 border text-left font-mono text-xs uppercase tracking-wider transition-all ${
                                    useCase === "tailoring"
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-border bg-background hover:border-foreground/50"
                                }`}
                            >
                                01. Structured Tailoring
                            </button>
                            <button
                                onClick={() => setUseCase("drapery")}
                                className={`p-4 border text-left font-mono text-xs uppercase tracking-wider transition-all ${
                                    useCase === "drapery"
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-border bg-background hover:border-foreground/50"
                                }`}
                            >
                                02. Architectural Drapery
                            </button>
                            <button
                                onClick={() => setUseCase("upholstery")}
                                className={`p-4 border text-left font-mono text-xs uppercase tracking-wider transition-all ${
                                    useCase === "upholstery"
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-border bg-background hover:border-foreground/50"
                                }`}
                            >
                                03. Heavy Upholstery
                            </button>
                        </div>

                        {/* Output Recommendation Card */}
                        <div className="p-6 bg-muted/40 border border-border">
                            {useCase === "tailoring" && (
                                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                    Recommended Match
                  </span>
                                    <p className="text-lg font-medium">Super 160s Merino Worsted & Giza 87 Twill</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Ideal balance of crease recovery, breathability, and sharp drape for jackets, trousers, and luxury shirting.
                                    </p>
                                </div>
                            )}
                            {useCase === "drapery" && (
                                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                    Recommended Match
                  </span>
                                    <p className="text-lg font-medium">Heavy Flemish Linen & Mulberry Silk Dupioni</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Offers rich acoustic absorption, soft light diffusion, and natural weight for floor-to-ceiling modern drapery.
                                    </p>
                                </div>
                            )}
                            {useCase === "upholstery" && (
                                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                    Recommended Match
                  </span>
                                    <p className="text-lg font-medium">340 g/m² Heavy Organic Flax & Wool-Linen Blends</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Tested for high Martindale rub counts with extreme tear resistance for bespoke furniture framing.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BRAND VALUES GRID --- */}
            <section className="py-20 border-b border-border">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 border border-border bg-card flex flex-col justify-between">
                            <Feather className="w-8 h-8 text-foreground mb-6" />
                            <div>
                                <h3 className="text-xl font-light mb-2">Uncompromised Tactility</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                    We believe true luxury is felt before it is seen. Every thread count, weave density, and finishing treatment is engineered for supreme sensory satisfaction.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 border border-border bg-card flex flex-col justify-between">
                            <Globe className="w-8 h-8 text-foreground mb-6" />
                            <div>
                                <h3 className="text-xl font-light mb-2">Regenerative Craft</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                    Our commitment goes beyond sustainability. We actively support regenerative agricultural mills that restore soil biology and protect regional heritage craft.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 border border-border bg-card flex flex-col justify-between">
                            <ShieldCheck className="w-8 h-8 text-foreground mb-6" />
                            <div>
                                <h3 className="text-xl font-light mb-2">Architectural Permanence</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                    Designed to outlast trends. Our textiles age gracefully over decades, developing a unique patina while preserving structural integrity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EDITORIAL FOOTER CTA --- */}
            <section className="py-24 bg-foreground text-background">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
          <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-4">
            Bespoke Swatch Service
          </span>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight max-w-2xl mx-auto mb-6">
                        Experience the Vestra Archive in your own hands.
                    </h2>
                    <p className="text-background/70 text-sm max-w-md mx-auto mb-8 font-light">
                        Request our curated tactile swatch booklet containing physical samples of our core seasonal textiles.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/shop"
                            className="px-8 py-4 bg-background text-foreground text-xs font-mono uppercase tracking-wider hover:bg-background/90 transition-all"
                        >
                            Order Swatch Kit
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}