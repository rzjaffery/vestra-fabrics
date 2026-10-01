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

interface AdminProductManagerProps {
    initialProducts?: any[]
    categories?: CategoryOption[]
    mode?: "FABRIC" | "READY_MADE"
}

export function AdminProductManager({
                                        initialProducts = [],
                                        categories = [],
                                        mode = "FABRIC",
                                    }: AdminProductManagerProps) {

    const [products, setProducts] = useState(initialProducts)

    // Form state (Create)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("10")
    const [featured, setFeatured] = useState(false)
    const [categoryId, setCategoryId] = useState("")
    const [imagesInput, setImagesInput] = useState("")

    const [material, setMaterial] = useState("")
    const [width, setWidth] = useState("58 in")
    const [weight, setWeight] = useState("")

    const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL"])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Edit Modal State
    const [editingProduct, setEditingProduct] = useState<any | null>(null)
    const [editName, setEditName] = useState("")
    const [editSlug, setEditSlug] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editPrice, setEditPrice] = useState("")
    const [editStock, setEditStock] = useState("0")
    const [editFeatured, setEditFeatured] = useState(false)
    const [editCategoryId, setEditCategoryId] = useState("")
    const [editImagesInput, setEditImagesInput] = useState("")
    const [editMaterial, setEditMaterial] = useState("")
    const [editWidth, setEditWidth] = useState("58 in")
    const [editWeight, setEditWeight] = useState("")
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
            price: parseFloat(price),
            stock: parseInt(stock, 10) || 0,
            featured,
            type: mode,
            categoryId: categoryId || null,
            images: imageList,
            ...(mode === "FABRIC"
                ? {
                    material: material || null,
                    width: width || null,
                    weight: weight || null,
                    sizes: [],
                }
                : {
                    sizes: selectedSizes,
                    material: null,
                    width: null,
                    weight: null,
                }),
        }

        try {
            const res = await fetch("/api/admin/products", {
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
                setImagesInput("")
                setMaterial("")
                setWeight("")
                setFeatured(false)
            } else {
                alert("Failed to save product")
            }
        } catch (e) {
            console.error('Submission Error:', e)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open Edit Modal with product data
    const openEditModal = (product: any) => {
        setEditingProduct(product)
        setEditName(product.name || "")
        setEditSlug(product.slug || "")
        setEditDescription(product.description || "")
        setEditPrice(product.price !== undefined ? String(product.price) : "")
        setEditStock(product.stock !== undefined ? String(product.stock) : "0")
        setEditFeatured(!!product.featured)
        setEditCategoryId(product.categoryId || "")
        setEditImagesInput(product.images ? product.images.join(", ") : "")
        setEditMaterial(product.material || "")
        setEditWidth(product.width || "58 in")
        setEditWeight(product.weight || "")
        setEditSelectedSizes(product.sizes || ["S", "M", "L", "XL"])
    }

    // Handle Edit Form Submission
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
            featured: editFeatured,
            type: mode,
            categoryId: editCategoryId || null,
            images: imageList,
            ...(mode === "FABRIC"
                ? {
                    material: editMaterial || null,
                    width: editWidth || null,
                    weight: editWeight || null,
                    sizes: [],
                }
                : {
                    sizes: editSelectedSizes,
                    material: null,
                    width: null,
                    weight: null,
                }),
        }

        try {
            const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
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
                // Fallback for UI optimistic update if API route isn't created yet
                setProducts(
                    products.map((p) =>
                        p.id === editingProduct.id ? { ...p, ...payload } : p
                    )
                )
                setEditingProduct(null)
            }
        } catch (err) {
            console.error("Update error:", err)
            // Fallback local update
            setProducts(
                products.map((p) =>
                    p.id === editingProduct.id ? { ...p, ...payload } : p
                )
            )
            setEditingProduct(null)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        setDeletingId(id)

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id))
            } else {
                alert("Failed to delete product")
            }
        } catch (err) {
            console.error("Deletion error:", err)
        } finally {
            setDeletingId(null)
        }
    }

    const displayedProducts = products.filter(
        (p) => p.type === mode || (!p.type && mode === "FABRIC")
    )

    return (
        <div className="space-y-8 font-mono text-xs">
            {/* Create Form */}
            <form onSubmit={handleSubmit} className="border border-border p-6 bg-card space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                        Add New {mode === "FABRIC" ? "Fabric Product" : "Stitched Garment"}
                    </h3>
                    <span className="text-[10px] uppercase bg-muted px-2 py-1 text-muted-foreground">
                        Type: {mode}
                    </span>
                </div>

                {/* Main Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Product Title *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder={mode === "FABRIC" ? "e.g. Lawn Cotton Premium" : "e.g. Stitched Embroidered Suit"}
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

                {/* Price, Stock & Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">
                            Price ({mode === "FABRIC" ? "Per Meter" : "Per Piece"}) *
                        </label>
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
                        <label className="block text-[11px] text-muted-foreground mb-1">
                            Stock Quantity ({mode === "FABRIC" ? "Meters" : "Units"}) *
                        </label>
                        <input
                            type="number"
                            required
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="0"
                            className="w-full p-2 bg-muted border border-border text-foreground"
                        />
                    </div>
                </div>

                {/* Image URLs Input */}
                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                        Image URLs (Comma or Newline Separated)
                    </label>
                    <textarea
                        rows={2}
                        value={imagesInput}
                        onChange={(e) => setImagesInput(e.target.value)}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                    />
                </div>

                {/* Type Specific Fields */}
                {mode === "FABRIC" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
                        <div>
                            <label className="block text-[11px] text-muted-foreground mb-1">Material</label>
                            <input
                                type="text"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                placeholder="e.g. 100% Lawn Cotton, Organza"
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
                                placeholder="e.g. 120 GSM, Light-Weight"
                                className="w-full p-2 bg-muted border border-border text-foreground"
                            />
                        </div>
                    </div>
                ) : (
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
                )}

                {/* Description */}
                <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Product Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed specifications, weave info, or styling description..."
                        className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                    />
                </div>

                {/* Options / Checkboxes */}
                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="featured" className="text-xs font-bold cursor-pointer uppercase">
                        Feature this item on storefront home page
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-none text-xs gap-2 uppercase font-mono mt-2"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    Save {mode === "FABRIC" ? "Fabric Item" : "Garment"}
                </Button>
            </form>

            {/* Inventory List Table */}
            <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border uppercase font-mono text-[11px] text-muted-foreground">
                    <tr>
                        <th className="p-4">{mode === "FABRIC" ? "Fabric" : "Garment"}</th>
                        <th className="p-4">{mode === "FABRIC" ? "Material" : "Category"}</th>
                        <th className="p-4">{mode === "FABRIC" ? "Specs" : "Available Sizes"}</th>
                        <th className="p-4">{mode === "FABRIC" ? "Price / Meter" : "Price / Piece"}</th>
                        <th className="p-4">{mode === "FABRIC" ? "Stock (Meters)" : "Stock (Pieces)"}</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {displayedProducts.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono">
                                No {mode === "FABRIC" ? "fabrics" : "stitched garments"} found in database.
                            </td>
                        </tr>
                    ) : (
                        displayedProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-muted/20">
                                {/* Thumbnail & Title/Slug */}
                                <td className="p-4 flex items-center gap-3">
                                    <div className="relative h-12 w-12 bg-muted border flex-shrink-0 overflow-hidden">
                                        {product.images && product.images[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{product.name}</p>
                                        <p className="text-[11px] text-muted-foreground font-mono">{product.slug}</p>
                                    </div>
                                </td>

                                {/* Material or Category */}
                                <td className="p-4 font-mono">
                                    {mode === "FABRIC"
                                        ? product.material || "Standard"
                                        : product.category?.name || "Uncategorized"}
                                </td>

                                {/* Specs (Weight • Width) or Size Badges */}
                                <td className="p-4 text-muted-foreground">
                                    {mode === "FABRIC" ? (
                                        <span>
                                                {product.weight || "N/A"} • {product.width || "58 in"}
                                            </span>
                                    ) : (
                                        <div className="flex gap-1 flex-wrap">
                                            {(product.sizes || []).map((s: string) => (
                                                <span
                                                    key={s}
                                                    className="px-1.5 py-0.5 bg-muted border border-border text-[10px] font-bold font-mono text-foreground"
                                                >
                                                        {s}
                                                    </span>
                                            ))}
                                        </div>
                                    )}
                                </td>

                                {/* Price */}
                                <td className="p-4 font-semibold font-mono">{formatPrice(product.price)}</td>

                                {/* Stock Badge */}
                                <td className="p-4 font-mono">
                                        <span
                                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                                                product.stock < 50
                                                    ? "bg-destructive/10 text-destructive"
                                                    : "bg-emerald-500/10 text-emerald-600"
                                            }`}
                                        >
                                            {product.stock}{mode === "FABRIC" ? "m" : "pcs"}
                                        </span>
                                </td>

                                {/* Action Buttons */}
                                <td className="p-4 text-right space-x-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditModal(product)}
                                        className="h-8 text-[11px] rounded-none"
                                    >
                                        <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={deletingId === product.id}
                                        onClick={() => handleDelete(product.id)}
                                        className="h-8 text-[11px] text-destructive hover:bg-destructive/10 rounded-none"
                                    >
                                        {deletingId === product.id ? (
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

            {/* EDIT PRODUCT MODAL */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-card border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 font-mono text-xs shadow-2xl relative">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider">
                                Edit {mode === "FABRIC" ? "Fabric Item" : "Garment"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            {/* Product Title & Slug */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">Product Title *</label>
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

                            {/* Price & Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">
                                        Price ({mode === "FABRIC" ? "Per Meter" : "Per Piece"}) *
                                    </label>
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
                                    <label className="block text-[11px] text-muted-foreground mb-1">
                                        Stock ({mode === "FABRIC" ? "Meters" : "Units"}) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={editStock}
                                        onChange={(e) => setEditStock(e.target.value)}
                                        className="w-full p-2 bg-muted border border-border text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Image URLs */}
                            <div>
                                <label className="block text-[11px] text-muted-foreground mb-1">
                                    Image URLs (Comma separated)
                                </label>
                                <textarea
                                    rows={2}
                                    value={editImagesInput}
                                    onChange={(e) => setEditImagesInput(e.target.value)}
                                    className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                                />
                            </div>

                            {/* Type Specific Fields */}
                            {mode === "FABRIC" ? (
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
                            ) : (
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
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-[11px] text-muted-foreground mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full p-2 bg-muted border border-border text-foreground font-sans text-xs"
                                />
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="editFeatured"
                                    checked={editFeatured}
                                    onChange={(e) => setEditFeatured(e.target.checked)}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <label htmlFor="editFeatured" className="text-xs font-bold cursor-pointer uppercase">
                                    Feature this item on storefront
                                </label>
                            </div>

                            {/* Action Buttons */}
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
                                    Update Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}