import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Product } from "@prisma/client"

export interface CartItem {
    product: Product
    quantity: number // Meters of fabric
}

interface CartStore {
    items: CartItem[]
    isOpen: boolean
    addItem: (product: Product, quantity?: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    toggleCart: () => void
    openCart: () => void
    closeCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1) => {
                const currentItems = get().items
                const existingItem = currentItems.find(
                    (item) => item.product.id === product.id
                )

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                        isOpen: true, // Automatically open cart drawer on item add
                    })
                } else {
                    set({
                        items: [...currentItems, { product, quantity }],
                        isOpen: true,
                    })
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.product.id !== productId),
                })
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set({
                    items: get().items.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                })
            },

            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                )
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },
        }),
        {
            name: "vestra-fabric-cart",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // Prevent Next.js server/client hydration mismatch
        }
    )
)