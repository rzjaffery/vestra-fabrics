"use client"

import React, { useState } from "react"
import { Ruler, Check, X, Info } from "lucide-react"

type Category = "shirt" | "kurta" | "suiting" | "waistcoat"

interface ProjectOption {
    id: string
    category: Category
    name: string
    baseMeters: number
    sizeMultiplier: Record<string, number>
}

const PROJECTS: ProjectOption[] = [
    {
        id: "dress-shirt",
        category: "shirt",
        name: "Formal Dress Shirt",
        baseMeters: 2.2,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.15, ExtraLarge: 1.3 },
    },
    {
        id: "kurta",
        category: "kurta",
        name: "Traditional Men's Kurta",
        baseMeters: 3.2,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.15, ExtraLarge: 1.3 },
    },
    {
        id: "suit-2pc",
        category: "suiting",
        name: "2-Piece Suit (Jacket + Trouser)",
        baseMeters: 3.5,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.15, ExtraLarge: 1.3 },
    },
    {
        id: "waistcoat",
        category: "waistcoat",
        name: "Tailored Nehru Waistcoat",
        baseMeters: 1.5,
        sizeMultiplier: { Small: 0.9, Medium: 1.0, Large: 1.1, ExtraLarge: 1.25 },
    },
]

interface YardageCalculatorModalProps {
    isOpen: boolean
    onClose: () => void
    fabricName: string
    defaultCategory?: Category
    onApplyMeters: (meters: number) => void
}

export default function YardageCalculatorModal({
                                                   isOpen,
                                                   onClose,
                                                   fabricName,
                                                   defaultCategory = "shirt",
                                                   onApplyMeters,
                                               }: YardageCalculatorModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category>(defaultCategory)
    const [selectedProjectId, setSelectedProjectId] = useState<string>(
        PROJECTS.find((p) => p.category === defaultCategory)?.id || "dress-shirt"
    )
    const [selectedSize, setSelectedSize] = useState<string>("Medium")
    const [hasPatternRepeat, setHasPatternRepeat] = useState<boolean>(false)

    if (!isOpen) return null

    const currentProject =
        PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0]

    const calculateMeters = (): number => {
        let meters = currentProject.baseMeters * (currentProject.sizeMultiplier[selectedSize] || 1.0)
        if (hasPatternRepeat) meters *= 1.15
        return Math.round(meters * 10) / 10
    }

    const calculatedMeters = calculateMeters()

    const handleApply = () => {
        onApplyMeters(calculatedMeters)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-background border border-border w-full max-w-2xl overflow-hidden shadow-2xl relative">

                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-mono uppercase tracking-widest font-semibold">
                            Meterage Estimator: {fabricName}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Domain Category Selector */}
                    <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                            Garment Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(["shirt", "kurta", "suiting", "waistcoat"] as Category[]).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat)
                                        const first = PROJECTS.find((p) => p.category === cat)
                                        if (first) setSelectedProjectId(first.id)
                                    }}
                                    className={`py-2 px-3 text-xs font-mono uppercase border transition-all ${
                                        selectedCategory === cat
                                            ? "bg-foreground text-background border-foreground font-semibold"
                                            : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Profile */}
                    <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                            Select Size
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.keys(currentProject.sizeMultiplier).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-2 text-xs font-mono border transition-all ${
                                        selectedSize === size
                                            ? "bg-foreground text-background border-foreground font-semibold"
                                            : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pattern Alignment */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                        <div>
                            <p className="text-xs font-medium">Plaid / Checks / Stripe Pattern?</p>
                            <p className="text-[11px] text-muted-foreground">Adds +15% cutting allowance for matching seams</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={hasPatternRepeat}
                            onChange={(e) => setHasPatternRepeat(e.target.checked)}
                            className="w-4 h-4 cursor-pointer accent-foreground"
                        />
                    </div>
                </div>

                {/* Footer / Apply CTA */}
                <div className="p-6 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Estimated Requirement
            </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-mono font-bold">{calculatedMeters}</span>
                            <span className="text-xs font-mono text-muted-foreground">Meters</span>
                        </div>
                    </div>

                    <button
                        onClick={handleApply}
                        className="w-full sm:w-auto bg-foreground text-background px-6 py-3 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <Check className="w-4 h-4" />
                        Apply {calculatedMeters}m to Order
                    </button>
                </div>

            </div>
        </div>
    )
}