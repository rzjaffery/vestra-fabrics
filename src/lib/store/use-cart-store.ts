// src/lib/store/use-cart-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
    id: string
    productId: string
    name: string
    slug: string
    price: number
    image: string
    itemType: "FABRIC" | "READY_MADE"
    selectedSize?: string
    meters?: number
    quantity: number
    stock: number
}

interface AddItemInput {
    productId: string
    name: string
    slug: string
    price: number
    image: string
    itemType: "FABRIC" | "READY_MADE"
    selectedSize?: string
    meters?: number
    quantity?: number
    stock: number
}

interface CartStore {
    items: CartItem[]
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
    toggleCart: () => void
    addItem: (item: AddItemInput) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            addItem: (newItem) => {
                const compositeId = `${newItem.productId}-${newItem.selectedSize || ""}-${newItem.meters || ""}`

                set((state) => {
                    const existingIndex = state.items.findIndex((i) => i.id === compositeId)

                    if (existingIndex > -1) {
                        const updatedItems = [...state.items]
                        if (newItem.itemType === "FABRIC" && newItem.meters) {
                            updatedItems[existingIndex].meters =
                                (updatedItems[existingIndex].meters || 0) + newItem.meters
                        } else {
                            updatedItems[existingIndex].quantity += newItem.quantity || 1
                        }
                        return { items: updatedItems, isOpen: true }
                    }

                    const cartItem: CartItem = {
                        id: compositeId,
                        productId: newItem.productId,
                        name: newItem.name,
                        slug: newItem.slug,
                        price: newItem.price,
                        image: newItem.image,
                        itemType: newItem.itemType,
                        selectedSize: newItem.selectedSize,
                        meters: newItem.meters,
                        quantity: newItem.quantity || 1,
                        stock: newItem.stock,
                    }

                    return { items: [...state.items, cartItem], isOpen: true }
                })
            },

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                })),

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + (item.quantity || 1), 0)
            },
        }),
        {
            name: "vestra-cart-storage",
        }
    )
)