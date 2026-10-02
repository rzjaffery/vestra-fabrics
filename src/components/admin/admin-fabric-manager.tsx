'use client'

import React, {useEffect, useState} from "react"
import Image from "next/image"
import { Plus, Trash2, Edit3, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format-price"

interface FabricItem {
    id: string
    name: string
    slug: string
    description?: string | null
    price: number
    stock: number
    material?: string | null
    width?: string | null
    weight?: string | null
    images: string[]
    featured: boolean
}

interface AdminFabricManagerProps {
    initialFabrics?: FabricItem[]
}

export function AdminFabricManager({ initialFabrics = [] }: AdminFabricManagerProps) {
    const [fabrics, setFabrics] = useState<FabricItem[]>(initialFabrics)

    // Form state (Create)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("10")
    const [material, setMaterial] = useState("")
    const [width, setWidth] = useState("58 in")
    const [weight, setWeight] = useState("")
    const [imagesInput, setImagesInput] = useState("")
    const [featured, setFeatured] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true) // 1. Track loading state
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Edit Modal State
    const [editingFabric, setEditingFabric] = useState<FabricItem | null>(null)
    const [editName, setEditName] = useState("")
    const [editSlug, setEditSlug] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editPrice, setEditPrice] = useState("")
    const [editStock, setEditStock] = useState("0")
    const [editMaterial, setEditMaterial] = useState("")
    const [editWidth, setEditWidth] = useState("58 in")
    const [editWeight, setEditWeight] = useState("")
    const [editImagesInput, setEditImagesInput] = useState("")
    const [editFeatured, setEditFeatured] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const fetchFabrics = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("/api/admin/fabrics")
            if (res.ok) {
                const data = await res.json()
                // Ensure data structure matches (data.fabrics or data)
                setFabrics(data.fabrics || data)
            } else {
                console.error("Failed to fetch fabrics status:", res.status)
            }
        } catch (err) {
            console.error("Error fetching fabrics:", err)
        } finally {
            setIsLoading(false) // Stop loading indicator
        }
    }

    useEffect(() => {
        fetchFabrics()
    }, [])

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "")
    }

    const handleNameChange = (val: string) => {
        setName(val)
        setSlug(generateSlug(val))
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const imageList = imagesInput
            .split(/[\n,]+/)
            .map((url) => url.trim())
            .filter(Boolean)

        const payload = {
            name,
            slug: slug || generateSlug(name),
            description: description || null,
            price: parseFloat(price) || 0,
            stock: parseFloat(stock) || 0,
            material: material || null,
            width: width || null,
            weight: weight || null,
            images: imageList,
            featured,
        }

        try {
            const res = await fetch("/api/admin/fabrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                const data = await res.json()
                setFabrics([data.fabric, ...fabrics])

                // Reset form
                setName("")
                setSlug("")
                setDescription("")
                setPrice("")
                setStock("10")
                setMaterial("")
                setWeight("")
                setImagesInput("")
                setFeatured(false)
            } else {
                alert("Failed to save fabric item")
            }
        } catch (e) {
            console.error("Fabric submission error:", e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const openEditModal = (fabric: FabricItem) => {
        setEditingFabric(fabric)
        setEditName(fabric.name || "")
        setEditSlug(fabric.slug || "")
        setEditDescription(fabric.description || "")
        setEditPrice(fabric.price !== undefined ? String(fabric.price) : "")
        setEditStock(fabric.stock !== undefined ? String(fabric.stock) : "0")
        setEditMaterial(fabric.material || "")
        setEditWidth(fabric.width || "58 in")
        setEditWeight(fabric.weight || "")
        setEditImagesInput(fabric.images ? fabric.images.join(", ") : "")
        setEditFeatured(fabric.featured)
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingFabric) return
        setIsUpdating(true)

        const imageList = editImagesInput
            .split(/[\n,]+/)
            .map((url) => url.trim())
            .filter(Boolean)

        const payload = {
            name: editName,
            slug: editSlug || generateSlug(editName),
            description: editDescription || null,
            price: parseFloat(editPrice) || 0,
            stock: parseFloat(editStock) || 0,
            material: editMaterial || null,
            width: editWidth || null,
            weight: editWeight || null,
            images: imageList,
            featured: editFeatured,
        }

        try {
            const res = await fetch(`/api/admin/fabrics/${editingFabric.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (res.ok) {
                const updated = data.fabric || { ...editingFabric, ...payload }
                setFabrics(fabrics.map((f) => (f.id === editingFabric.id ? updated : f)))
                setEditingFabric(null)
            } else {
                // Log and display the exact error returned by the server
                console.error("API Error Response:", data)
                alert(data.error || data.message || "Failed to update fabric")
            }
        } catch (err) {
            console.error("Update error:", err)
            alert("A network error occurred.")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this fabric?")) return
        setDeletingId(id)

        try {
            const res = await fetch(`/api/admin/fabrics/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                setFabrics(fabrics.filter((f) => f.id !== id))
            } else {
                alert("Failed to delete fabric")
            }
        } catch (err) {
            console.error("Deletion error:", err)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-8 font-mono text-xs">
            {/* Create Fabric Form */}
            <form onSubmit={handleSubmit} className="border border-border p-6 bg-card space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Add New Fabric Product</h3>
                    <span className="text-[10px] uppercase bg-muted px-2 py-1 text-muted-foreground">
                        Entity: Fabric
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Fabric Title *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g. Lawn Cotton Premium"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Slug (URL Keyword) *</label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. lawn-cotton-premium"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Price Per Meter *</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Stock Quantity (Meters) *</label>
                        <input
                            type="number"
                            required
                            step="0.1"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="0.0"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Material</label>
                        <input
                            type="text"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            placeholder="e.g. 100% Lawn Cotton"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Fabric Width</label>
                        <input
                            type="text"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="e.g. 58 inches"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Fabric Weight</label>
                        <input
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="e.g. 120 GSM"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Image URLs (Comma/Newline)</label>
                    <textarea
                        rows={2}
                        value={imagesInput}
                        onChange={(e) => setImagesInput(e.target.value)}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                    />
                </div>

                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Product Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Weave details, thread count, styling details..."
                        className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                    />
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="fabricFeatured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="fabricFeatured" className="text-xs font-bold cursor-pointer uppercase">
                        Feature this fabric on home page
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-none text-xs gap-2 uppercase font-mono mt-2"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Save Fabric Item
                </Button>
            </form>

            <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border uppercase font-mono text-[11px] text-muted-foreground">
                    <tr>
                        <th className="p-4">Fabric</th>
                        <th className="p-4">Material</th>
                        <th className="p-4">Specs</th>
                        <th className="p-4">Price / Meter</th>
                        <th className="p-4">Stock (Meters)</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {/* 3. Handle Loading State FIRST */}
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono">
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading fabrics...
                                </div>
                            </td>
                        </tr>
                    ) : fabrics.length === 0 ? (
                        /* 4. Handle Empty Database State ONLY when loading is finished */
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono">
                                No fabrics found in database.
                            </td>
                        </tr>
                    ) : (
                        /* 5. Render Fabrics */
                        fabrics.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/20">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="relative h-12 w-12 bg-muted border flex-shrink-0 overflow-hidden">
                                        {item.images && item.images[0] ? (
                                            <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <p className="text-[11px] text-muted-foreground font-mono">{item.slug}</p>
                                    </div>
                                </td>

                                <td className="p-4 font-mono">{item.material || "Standard"}</td>

                                <td className="p-4 text-muted-foreground">
                                    {item.weight || "N/A"} • {item.width || "58 in"}
                                </td>

                                <td className="p-4 font-semibold font-mono">{formatPrice(item.price)}</td>

                                <td className="p-4 font-mono">
                                    <span
                                        className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                                            item.stock < 50
                                                ? "bg-destructive/10 text-destructive"
                                                : "bg-emerald-500/10 text-emerald-600"
                                        }`}
                                    >
                                        {item.stock}m
                                    </span>
                                </td>

                                <td className="p-4 text-right space-x-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditModal(item)}
                                        className="h-8 text-[11px] rounded-none"
                                    >
                                        <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={deletingId === item.id}
                                        onClick={() => handleDelete(item.id)}
                                        className="h-8 text-[11px] text-destructive hover:bg-destructive/10 rounded-none"
                                    >
                                        {deletingId === item.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            {/* EDIT FABRIC MODAL */}
            {editingFabric && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-card border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 font-mono text-xs shadow-2xl relative">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Edit Fabric Item</h3>
                            <button
                                type="button"
                                onClick={() => setEditingFabric(null)}
                                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Fabric Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editName}
                                        onChange={(e) => {
                                            setEditName(e.target.value)
                                            setEditSlug(generateSlug(e.target.value))
                                        }}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Slug *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editSlug}
                                        onChange={(e) => setEditSlug(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Price Per Meter *</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Stock (Meters) *</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.1"
                                        value={editStock}
                                        onChange={(e) => setEditStock(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Material</label>
                                    <input
                                        type="text"
                                        value={editMaterial}
                                        onChange={(e) => setEditMaterial(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Fabric Width</label>
                                    <input
                                        type="text"
                                        value={editWidth}
                                        onChange={(e) => setEditWidth(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Fabric Weight</label>
                                    <input
                                        type="text"
                                        value={editWeight}
                                        onChange={(e) => setEditWeight(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] text-muted-foreground mb-1">Image URLs</label>
                                <textarea
                                    rows={2}
                                    value={editImagesInput}
                                    onChange={(e) => setEditImagesInput(e.target.value)}
                                    className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-muted-foreground mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="editFabricFeatured"
                                    checked={editFeatured}
                                    onChange={(e) => setEditFeatured(e.target.checked)}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <label htmlFor="editFabricFeatured" className="text-xs font-bold cursor-pointer uppercase">
                                    Feature on storefront
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingFabric(null)}
                                    className="rounded-none text-xs uppercase font-mono"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="rounded-none text-xs gap-2 uppercase font-mono"
                                >
                                    {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Update Fabric
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}