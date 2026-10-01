'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function AdminReadyMadeManager({ initialProducts = [], categories = [] }: any) {
    const [products, setProducts] = useState(initialProducts)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("10")
    const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"])

    const toggleSize = (size: string) => {
        setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
    }

    return (
        <div className="space-y-8 font-mono text-xs">
            <form className="border border-border p-6 bg-card space-y-4">
                <h3 className="text-sm font-bold uppercase border-b pb-3">Add Stitched Garment</h3>
                <input placeholder="Garment Name *" required value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-muted border" />

                {/* Size Selector */}
                <div>
                    <label className="block mb-2 text-muted-foreground">Available Sizes</label>
                    <div className="flex gap-2">
                        {SIZES.map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleSize(s)}
                                className={`px-3 py-1 border ${selectedSizes.includes(s) ? 'bg-foreground text-background' : 'bg-muted'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <Button type="submit" className="rounded-none uppercase">Save Garment</Button>
            </form>
        </div>
    )
}