'use client'

import React, { useState } from "react"
import Image from "next/image"
import { Plus, Trash2, Edit3, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format-price"

export function AdminFabricManager({ initialFabrics = [] }: { initialFabrics?: any[] }) {
    const [fabrics, setFabrics] = useState(initialFabrics)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("10")
    const [material, setMaterial] = useState("")
    const [width, setWidth] = useState("58 in")
    const [weight, setWeight] = useState("")
    const [imagesInput, setImagesInput] = useState("")
    const [description, setDescription] = useState("")
    const [featured, setFeatured] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit state
    const [editingFabric, setEditingFabric] = useState<any | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const payload = {
            name, slug, description,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            material, width, weight,
            featured,
            images: imagesInput.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
        }

        const res = await fetch("/api/admin/fabrics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            const data = await res.json()
            setFabrics([data.fabric, ...fabrics])
            setName(""); setSlug(""); setPrice(""); setImagesInput(""); setMaterial("")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="space-y-8 font-mono text-xs">
            {/* Dedicated Fabric Creation Form */}
            <form onSubmit={handleSubmit} className="border border-border p-6 bg-card space-y-4">
                <h3 className="text-sm font-bold uppercase border-b pb-3">Add New Fabric</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Fabric Name *" required value={name} onChange={e => setName(e.target.value)} className="p-2 bg-muted border" />
                    <input placeholder="Slug *" required value={slug} onChange={e => setSlug(e.target.value)} className="p-2 bg-muted border" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Price / Meter *" type="number" required value={price} onChange={e => setPrice(e.target.value)} className="p-2 bg-muted border" />
                    <input placeholder="Stock (Meters) *" type="number" required value={stock} onChange={e => setStock(e.target.value)} className="p-2 bg-muted border" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <input placeholder="Material (e.g. Lawn)" value={material} onChange={e => setMaterial(e.target.value)} className="p-2 bg-muted border" />
                    <input placeholder="Width (e.g. 58 in)" value={width} onChange={e => setWidth(e.target.value)} className="p-2 bg-muted border" />
                    <input placeholder="Weight (e.g. 120 GSM)" value={weight} onChange={e => setWeight(e.target.value)} className="p-2 bg-muted border" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="rounded-none uppercase">Save Fabric</Button>
            </form>

            {/* Dedicated Fabric Table */}
            <div className="border border-border bg-card">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b p-4 uppercase">
                    <tr>
                        <th className="p-4">Fabric</th>
                        <th className="p-4">Material / Specs</th>
                        <th className="p-4">Price / Meter</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y border-border">
                    {fabrics.map((item) => (
                        <tr key={item.id}>
                            <td className="p-4 font-bold">{item.name}</td>
                            <td className="p-4">{item.material} ({item.width})</td>
                            <td className="p-4">{formatPrice(item.price)}</td>
                            <td className="p-4">{item.stock}m</td>
                            <td className="p-4 text-right">
                                <Button size="sm" variant="outline" onClick={() => setEditingFabric(item)}><Edit3 className="h-3 w-3" /></Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}