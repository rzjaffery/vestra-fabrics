'use client'

import React, { useState } from "react"
import Image from "next/image"
import { Plus, Trash2, Edit3, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format-price"

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface CategoryOption {
    id: string
    name: string
}

interface ReadyMadeItem {
    id: string
    name: string
    slug: string
    description?: string | null
    price: number
    stock: number
    sizes: string[]
    categoryId?: string | null
    category?: CategoryOption | null
    images: string[]
    featured: boolean
}

interface AdminReadyMadeManagerProps {
    initialProducts?: ReadyMadeItem[]
    categories?: CategoryOption[]
}

export function AdminReadyMadeManager({
                                          initialProducts = [],
                                          categories = [],
                                      }: AdminReadyMadeManagerProps) {
    const [products, setProducts] = useState<ReadyMadeItem[]>(initialProducts)

    // Form state (Create)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("10")
    const [categoryId, setCategoryId] = useState("")
    const [imagesInput, setImagesInput] = useState("")
    const [featured, setFeatured] = useState(false)
    const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL"])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Edit Modal State
    const [editingProduct, setEditingProduct] = useState<ReadyMadeItem | null>(null)
    const [editName, setEditName] = useState("")
    const [editSlug, setEditSlug] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editPrice, setEditPrice] = useState("")
    const [editStock, setEditStock] = useState("0")
    const [editCategoryId, setEditCategoryId] = useState("")
    const [editImagesInput, setEditImagesInput] = useState("")
    const [editFeatured, setEditFeatured] = useState(false)
    const [editSelectedSizes, setEditSelectedSizes] = useState<string[]>([])
    const [isUpdating, setIsUpdating] = useState(false)

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

    const toggleSize = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter((s) => s !== size))
        } else {
            setSelectedSizes([...selectedSizes, size])
        }
    }

    const toggleEditSize = (size: string) => {
        if (editSelectedSizes.includes(size)) {
            setEditSelectedSizes(editSelectedSizes.filter((s) => s !== size))
        } else {
            setEditSelectedSizes([...editSelectedSizes, size])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
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
            stock: parseInt(stock, 10) || 0,
            categoryId: categoryId || null,
            sizes: selectedSizes,
            images: imageList,
            featured,
        }

        try {
            const res = await fetch("/api/admin/ready-made", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                const data = await res.json()
                setProducts([data.product, ...products])

                // Reset form
                setName("")
                setSlug("")
                setDescription("")
                setPrice("")
                setStock("10")
                setCategoryId("")
                setImagesInput("")
                setFeatured(false)
            } else {
                alert("Failed to save ready-made garment")
            }
        } catch (e) {
            console.error("Garment submission error:", e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const openEditModal = (item: ReadyMadeItem) => {
        setEditingProduct(item)
        setEditName(item.name || "")
        setEditSlug(item.slug || "")
        setEditDescription(item.description || "")
        setEditPrice(item.price !== undefined ? String(item.price) : "")
        setEditStock(item.stock !== undefined ? String(item.stock) : "0")
        setEditCategoryId(item.categoryId || "")
        setEditImagesInput(item.images ? item.images.join(", ") : "")
        setEditFeatured(!!item.featured)
        setEditSelectedSizes(item.sizes || ["S", "M", "L", "XL"])
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingProduct) return
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
            stock: parseInt(editStock, 10) || 0,
            categoryId: editCategoryId || null,
            sizes: editSelectedSizes,
            images: imageList,
            featured: editFeatured,
        }

        try {
            const res = await fetch(`/api/admin/ready-made/${editingProduct.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                const data = await res.json()
                const updated = data.product || { ...editingProduct, ...payload }
                setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)))
                setEditingProduct(null)
            } else {
                alert("Failed to update product")
            }
        } catch (err) {
            console.error("Update error:", err)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this garment?")) return
        setDeletingId(id)

        try {
            const res = await fetch(`/api/admin/ready-made/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id))
            } else {
                alert("Failed to delete garment")
            }
        } catch (err) {
            console.error("Deletion error:", err)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-8 font-mono text-xs">
            {/* Create Garment Form */}
            <form onSubmit={handleSubmit} className="border border-border p-6 bg-card space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Add New Stitched Garment</h3>
                    <span className="text-[10px] uppercase bg-muted px-2 py-1 text-muted-foreground">
                        Entity: Ready-Made
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Garment Title *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g. Stitched Embroidered Kurti"
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
                            placeholder="e.g. stitched-embroidered-kurti"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Price Per Piece *</label>
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
                        <label className="block text-[11px] text-muted-foreground mb-1">Stock Quantity (Pieces) *</label>
                        <input
                            type="number"
                            required
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="0"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        >
                            <option value="">Select Category...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sizes Selection */}
                <div className="pt-2 border-t border-border">
                    <label className="block text-[11px] text-muted-foreground mb-2">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_SIZES.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-3 py-1.5 border uppercase font-bold transition-colors ${
                                    selectedSizes.includes(size)
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-muted text-muted-foreground border-border"
                                }`}
                            >
                                {size}
                            </button>
                        ))}
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
                        placeholder="Detailed garment specifications, fitting, styling..."
                        className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                    />
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="readyMadeFeatured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="readyMadeFeatured" className="text-xs font-bold cursor-pointer uppercase">
                        Feature this garment on home page
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-none text-xs gap-2 uppercase font-mono mt-2"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Save Garment
                </Button>
            </form>

            {/* Ready Made Table */}
            <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border uppercase font-mono text-[11px] text-muted-foreground">
                    <tr>
                        <th className="p-4">Garment</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Available Sizes</th>
                        <th className="p-4">Price / Piece</th>
                        <th className="p-4">Stock (Pieces)</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono">
                                No stitched garments found in database.
                            </td>
                        </tr>
                    ) : (
                        products.map((item) => (
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

                                <td className="p-4 font-mono">
                                    {item.category?.name || "Uncategorized"}
                                </td>

                                <td className="p-4 text-muted-foreground">
                                    <div className="flex gap-1 flex-wrap">
                                        {(item.sizes || []).map((s) => (
                                            <span
                                                key={s}
                                                className="px-1.5 py-0.5 bg-muted border border-border text-[10px] font-bold font-mono text-foreground"
                                            >
                                                    {s}
                                                </span>
                                        ))}
                                    </div>
                                </td>

                                <td className="p-4 font-semibold font-mono">{formatPrice(item.price)}</td>

                                <td className="p-4 font-mono">
                                        <span
                                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                                                item.stock < 10
                                                    ? "bg-destructive/10 text-destructive"
                                                    : "bg-emerald-500/10 text-emerald-600"
                                            }`}
                                        >
                                            {item.stock}pcs
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

            {/* EDIT GARMENT MODAL */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-card border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 font-mono text-xs shadow-2xl relative">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Edit Stitched Garment</h3>
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Garment Title *</label>
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Price Per Piece *</label>
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
                                    <label className="block text-[11px] text-muted-foreground mb-1">Stock (Pieces) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={editStock}
                                        onChange={(e) => setEditStock(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Category</label>
                                    <select
                                        value={editCategoryId}
                                        onChange={(e) => setEditCategoryId(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    >
                                        <option value="">Select Category...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border">
                                <label className="block text-[11px] text-muted-foreground mb-2">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_SIZES.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleEditSize(size)}
                                            className={`px-3 py-1.5 border uppercase font-bold transition-colors ${
                                                editSelectedSizes.includes(size)
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-muted text-muted-foreground border-border"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
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
                                    id="editReadyMadeFeatured"
                                    checked={editFeatured}
                                    onChange={(e) => setEditFeatured(e.target.checked)}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <label htmlFor="editReadyMadeFeatured" className="text-xs font-bold cursor-pointer uppercase">
                                    Feature on storefront
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingProduct(null)}
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
                                    Update Garment
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}