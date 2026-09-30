"use client"

import { useState } from "react"
import Image from "next/image"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit3, Loader2, X } from "lucide-react"

interface AdminProductManagerProps {
    initialProducts: any[]
}

export function AdminProductManager({ initialProducts }: AdminProductManagerProps) {
    const [products, setProducts] = useState(initialProducts)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        material: "100% Cotton",
        weight: "180 gsm",
        width: "58 inches",
        stock: "100",
        description: "",
        images: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000&auto=format&fit=crop",
    })

    const openAddModal = () => {
        setEditingProduct(null)
        setFormData({
            name: "",
            price: "",
            material: "100% Cotton",
            weight: "180 gsm",
            width: "58 inches",
            stock: "100",
            description: "",
            images: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000&auto=format&fit=crop",
        })
        setIsModalOpen(true)
    }

    const openEditModal = (product: any) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            price: product.price.toString(),
            material: product.material,
            weight: product.weight,
            width: product.width,
            stock: product.stock.toString(),
            description: product.description,
            images: product.images[0] || "",
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this fabric listing?")) return

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const url = editingProduct
                ? `/api/admin/products/${editingProduct.id}`
                : "/api/admin/products"
            const method = editingProduct ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                if (editingProduct) {
                    setProducts(products.map((p) => (p.id === editingProduct.id ? data.product : p)))
                } else {
                    setProducts([data.product, ...products])
                }
                setIsModalOpen(false)
            } else {
                alert(data.error || "Failed to save product")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-xs font-mono text-muted-foreground uppercase">
                    Showing {products.length} Fabrics in Inventory
                </p>
                <Button onClick={openAddModal} className="rounded-none text-xs uppercase tracking-wider flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add New Fabric
                </Button>
            </div>

            {/* Fabric Table */}
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
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/20">
                            <td className="p-4 flex items-center gap-3">
                                <div className="relative h-12 w-12 bg-muted border flex-shrink-0">
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{product.name}</p>
                                    <p className="text-[11px] text-muted-foreground font-mono">{product.slug}</p>
                                </div>
                            </td>
                            <td className="p-4 font-mono">{product.material}</td>
                            <td className="p-4 text-muted-foreground">
                                {product.weight} • {product.width}
                            </td>
                            <td className="p-4 font-semibold font-mono">{formatPrice(product.price)}</td>
                            <td className="p-4 font-mono">
                  <span
                      className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                          product.stock < 50
                              ? "bg-destructive/10 text-destructive"
                              : "bg-emerald-500/10 text-emerald-600"
                      }`}
                  >
                    {product.stock}m
                  </span>
                            </td>
                            <td className="p-4 text-right ">
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
                                    onClick={() => handleDelete(product.id)}
                                    className="h-8 text-[11px] text-destructive hover:bg-destructive/10 rounded-none"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Fabric Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="border border-border bg-card w-full max-w-lg p-6 space-y-6 shadow-xl relative">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-base font-light uppercase tracking-wider">
                                {editingProduct ? "Edit Fabric Listing" : "Add New Fabric"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-muted-foreground mb-1">Fabric Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Belgian Linen"
                                    className="w-full border p-2 bg-background font-medium focus:outline-none focus:border-foreground"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-muted-foreground mb-1">Price per Meter (PKR) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="4500"
                                        className="w-full border p-2 bg-background font-mono focus:outline-none focus:border-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-muted-foreground mb-1">Stock Available (Meters) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="250"
                                        className="w-full border p-2 bg-background font-mono focus:outline-none focus:border-foreground"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-muted-foreground mb-1">Material</label>
                                    <input
                                        type="text"
                                        value={formData.material}
                                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                        className="w-full border p-2 bg-background focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-muted-foreground mb-1">Weight (GSM)</label>
                                    <input
                                        type="text"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full border p-2 bg-background focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-muted-foreground mb-1">Width</label>
                                    <input
                                        type="text"
                                        value={formData.width}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                        className="w-full border p-2 bg-background focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-muted-foreground mb-1">Fabric Image URL *</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.images}
                                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                    className="w-full border p-2 bg-background font-mono focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-muted-foreground mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border p-2 bg-background focus:outline-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-none uppercase text-xs tracking-widest h-11"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Fabric Listing"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}