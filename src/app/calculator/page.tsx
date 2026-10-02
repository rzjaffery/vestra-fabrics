"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
    Ruler,
    Scissors,
    Sparkles,
    ArrowRight,
    Info,
    CheckCircle2,
    RefreshCw,
    Layers,
    Sliders,
} from "lucide-react"

// --- ESTIMATION CONFIG & TYPES ---
type Category = "apparel" | "drapery" | "upholstery"

interface ProjectOption {
    id: string
    category: Category
    name: string
    description: string
    baseMeters: number // Based on standard 140cm (55") bolt width
    sizeMultiplier: { [key: string]: number }
}

const PROJECTS: ProjectOption[] = [
    // Apparel
    {
        id: "blazer",
        category: "apparel",
        name: "Tailored Jacket / Blazer",
        description: "Single or double-breasted suit jacket with standard lapels.",
        baseMeters: 2.2,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.15, ExtraLarge: 1.3 },
    },
    {
        id: "suit-2pc",
        category: "apparel",
        name: "2-Piece Suit (Jacket + Trousers)",
        description: "Standard formal 2-piece tailoring with standard lining.",
        baseMeters: 3.5,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.15, ExtraLarge: 1.3 },
    },
    {
        id: "overcoat",
        category: "apparel",
        name: "Bespoke Trench / Overcoat",
        description: "Full-length heavy outerwear with welt pockets and storm flap.",
        baseMeters: 4.2,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.15, ExtraLarge: 1.3 },
    },
    {
        id: "trousers",
        category: "apparel",
        name: "Pleated Trousers",
        description: "High-waisted tailored trousers with turn-up cuffs.",
        baseMeters: 1.6,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.15, ExtraLarge: 1.3 },
    },

    // Drapery
    {
        id: "drapes-standard",
        category: "drapery",
        name: "Standard Window Drapes (Pair)",
        description: "Floor-length window curtains with standard 2x wave fullness.",
        baseMeters: 6.0,
        sizeMultiplier: { Standard: 1.0, HighCeiling: 1.3, GrandArch: 1.6 },
    },
    {
        id: "drapes-full",
        category: "drapery",
        name: "Architectural Wall-to-Wall Drapery",
        description: "Heavy triple-pleat acoustic drapery spanning full room walls.",
        baseMeters: 12.0,
        sizeMultiplier: { Standard: 1.0, HighCeiling: 1.3, GrandArch: 1.6 },
    },

    // Upholstery
    {
        id: "armchair",
        category: "upholstery",
        name: "Accent Armchair",
        description: "Fully upholstered deep-seat lounge or reading chair.",
        baseMeters: 5.5,
        sizeMultiplier: { Compact: 0.85, Standard: 1.0, Oversized: 1.25 },
    },
    {
        id: "sofa-3seat",
        category: "upholstery",
        name: "3-Seater Sofa",
        description: "Standard 3-cushion sofa including frame and back cushions.",
        baseMeters: 14.0,
        sizeMultiplier: { Compact: 0.85, Standard: 1.0, Oversized: 1.25 },
    },
]

export default function CalculatorPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>("apparel")
    const [selectedProjectId, setSelectedProjectId] = useState<string>("suit-2pc")
    const [selectedSize, setSelectedSize] = useState<string>("Medium")
    const [fabricWidth, setFabricWidth] = useState<number>(140) // 140cm standard vs 110cm narrow
    const [hasPatternRepeat, setHasPatternRepeat] = useState<boolean>(false) // Checks/Plaids need extra matching space

    // Current active project definition
    const currentProject =
        PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[1]

    // Calculate required meterage dynamically
    const calculateMeterage = (): number => {
        let result = currentProject.baseMeters

        // Apply size multiplier
        const multiplier = currentProject.sizeMultiplier[selectedSize] || 1.0
        result *= multiplier

        // Adjust for narrower bolt width (110cm requires ~25% more meterage than 140cm)
        if (fabricWidth === 110) {
            result *= 1.25
        }

        // Adjust for pattern repeat alignment (plaids, stripes, jacquards need ~15% buffer)
        if (hasPatternRepeat) {
            result *= 1.15
        }

        return Math.round(result * 10) / 10 // Round to 1 decimal place
    }

    const estimatedMeters = calculateMeterage()

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">

            {/* HEADER SECTION */}
            <section className="border-b border-border py-16 md:py-24 bg-muted/10">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                        <Ruler className="w-3.5 h-3.5 text-amber-500" />
                        <span>Atelier Utility</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight max-w-3xl mb-6">
                        Bespoke Meterage & <span className="italic font-serif font-normal">Yardage Estimator</span>
                    </h1>

                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light max-w-2xl">
                        Calculate precise bolt requirements for tailoring, architectural drapery, or fine furniture upholstery before placing your archive order.
                    </p>
                </div>
            </section>

            {/* CALCULATOR MAIN INTERFACE */}
            <section className="py-16 border-b border-border">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* LEFT COLUMN: CONTROLS & INPUTS */}
                        <div className="lg:col-span-7 space-y-8">

                            {/* Step 1: Category Filter */}
                            <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-3">
                  01. Select Project Domain
                </span>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["apparel", "drapery", "upholstery"] as Category[]).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCategory(cat)
                                                // Auto-select first project in domain
                                                const first = PROJECTS.find((p) => p.category === cat)
                                                if (first) {
                                                    setSelectedProjectId(first.id)
                                                    setSelectedSize(Object.keys(first.sizeMultiplier)[1] || "Medium")
                                                }
                                            }}
                                            className={`p-3.5 text-xs font-mono uppercase tracking-wider border transition-all ${
                                                selectedCategory === cat
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2: Specific Project Selection */}
                            <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-3">
                  02. Choose Specific Garment or Item
                </span>
                                <div className="space-y-3">
                                    {PROJECTS.filter((p) => p.category === selectedCategory).map((proj) => (
                                        <button
                                            key={proj.id}
                                            onClick={() => {
                                                setSelectedProjectId(proj.id)
                                                setSelectedSize(Object.keys(proj.sizeMultiplier)[1] || "Medium")
                                            }}
                                            className={`w-full p-4 text-left border transition-all flex justify-between items-center ${
                                                selectedProjectId === proj.id
                                                    ? "border-foreground bg-card shadow-sm"
                                                    : "border-border bg-background hover:border-foreground/30"
                                            }`}
                                        >
                                            <div>
                                                <p className="text-sm font-medium">{proj.name}</p>
                                                <p className="text-xs text-muted-foreground font-light mt-0.5">
                                                    {proj.description}
                                                </p>
                                            </div>
                                            {selectedProjectId === proj.id && (
                                                <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 ml-4" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Step 3: Dimensions & Fine Tuning */}
                            <div className="p-6 border border-border bg-card space-y-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block border-b border-border pb-3">
                  03. Technical Parameters
                </span>

                                {/* Scale / Size Selector */}
                                <div>
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                                        Scale / Dimensions:
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {Object.keys(currentProject.sizeMultiplier).map((sizeKey) => (
                                            <button
                                                key={sizeKey}
                                                onClick={() => setSelectedSize(sizeKey)}
                                                className={`py-2 text-xs font-mono transition-all border ${
                                                    selectedSize === sizeKey
                                                        ? "bg-foreground text-background border-foreground font-bold"
                                                        : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                                                }`}
                                            >
                                                {sizeKey}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Bolt Width Toggle */}
                                <div>
                                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                                        Bolt Roll Width:
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setFabricWidth(140)}
                                            className={`p-3 text-xs font-mono text-left border transition-all ${
                                                fabricWidth === 140
                                                    ? "border-foreground bg-background font-semibold"
                                                    : "border-border text-muted-foreground hover:border-foreground/40"
                                            }`}
                                        >
                                            <span>140 cm / 55" (Standard)</span>
                                        </button>
                                        <button
                                            onClick={() => setFabricWidth(110)}
                                            className={`p-3 text-xs font-mono text-left border transition-all ${
                                                fabricWidth === 110
                                                    ? "border-foreground bg-background font-semibold"
                                                    : "border-border text-muted-foreground hover:border-foreground/40"
                                            }`}
                                        >
                                            <span>110 cm / 44" (Narrow Bolt)</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Pattern Matching Toggle */}
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <p className="text-xs font-medium">Pattern Repeat / Plaid / Stripes?</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            Adds +15% yardage buffer for seam alignment.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setHasPatternRepeat(!hasPatternRepeat)}
                                        className={`w-12 h-6 rounded-full transition-colors relative border ${
                                            hasPatternRepeat ? "bg-foreground border-foreground" : "bg-muted border-border"
                                        }`}
                                    >
                    <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${
                            hasPatternRepeat ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: REAL-TIME CALCULATION SUMMARY */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24 border border-border bg-card p-8">

                                <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Estimation Output
                  </span>
                                    <Scissors className="w-4 h-4 text-muted-foreground" />
                                </div>

                                <div className="mb-8">
                  <span className="text-xs font-mono text-muted-foreground block mb-1 uppercase">
                    Recommended Quantity
                  </span>
                                    <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-light font-mono tracking-tight">
                      {estimatedMeters}
                    </span>
                                        <span className="text-xl font-mono text-muted-foreground">Meters</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                        ≈ {(estimatedMeters * 1.09361).toFixed(1)} Yards
                                    </p>
                                </div>

                                {/* Breakdown Summary */}
                                <div className="space-y-3 py-4 border-y border-border text-xs font-mono mb-8">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Selected Item:</span>
                                        <span className="text-foreground font-medium">{currentProject.name}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Scale Profile:</span>
                                        <span className="text-foreground font-medium">{selectedSize}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Bolt Width Spec:</span>
                                        <span className="text-foreground font-medium">{fabricWidth} cm</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Pattern Alignment Allowance:</span>
                                        <span className="text-foreground font-medium">
                      {hasPatternRepeat ? "+15% Included" : "None"}
                    </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/40 border border-border text-xs leading-relaxed text-muted-foreground mb-8">
                                    <p className="flex gap-2">
                                        <Info className="w-4 h-4 shrink-0 text-foreground mt-0.5" />
                                        <span>
                      Estimates include standard 10% cutting waste. Always verify exact measurements with your master tailor or upholsterer prior to final cutting.
                    </span>
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href="/shop"
                                        className="w-full bg-foreground text-background py-4 text-xs font-mono uppercase tracking-wider block text-center hover:opacity-90 transition-all"
                                    >
                                        Browse Fabrics for {estimatedMeters}m Order
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    )
}