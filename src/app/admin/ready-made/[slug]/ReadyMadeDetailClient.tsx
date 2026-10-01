'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ReadyMadeDetail } from './page'

interface ReadyMadeDetailClientProps {
    product: ReadyMadeDetail
}

export default function ReadyMadeDetailClient({ product }: ReadyMadeDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [quantity, setQuantity] = useState<number>(1)
    const [showSizeChart, setShowSizeChart] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [addedSuccess, setAddedSuccess] = useState(false)

    // Get active size variant details
    const activeVariant = product.sizeVariants.find((v) => v.size === selectedSize)
    const maxAvailableStock = activeVariant ? activeVariant.inStock : 0

    const handleSizeSelect = (size: string, inStock: number) => {
        if (inStock <= 0) return
        setSelectedSize(size)
        setError(null)

        // Reset or adjust quantity if it exceeds stock of newly selected size
        if (quantity > inStock) {
            setQuantity(inStock)
        } else if (quantity < 1) {
            setQuantity(1)
        }
    }

    const handleQuantityChange = (delta: number) => {
        if (!selectedSize) {
            setError('Please select a size first')
            return
        }

        const nextQty = quantity + delta
        if (nextQty < 1) return
        if (nextQty > maxAvailableStock) {
            setError(`Only ${maxAvailableStock} piece(s) available in size ${selectedSize}`)
            return
        }

        setError(null)
        setQuantity(nextQty)
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
            setError('Please choose a size before adding to cart')
            return
        }

        if (quantity > maxAvailableStock || maxAvailableStock <= 0) {
            setError('Selected size is currently out of stock')
            return
        }

        setIsAdding(true)

        // Cart payload
        const cartItem = {
            id: `${product.id}-${selectedSize}`,
            type: 'READY_MADE' as const,
            readyMadeProductId: product.id,
            name: product.name,
            price: product.price,
            quantity, // Represents unit count
            unitLabel: 'unit',
            selectedSize,
            image: product.images[0],
            totalPrice: product.price * quantity,
        }

        console.log('Adding ready-to-wear item to cart:', cartItem)

        setTimeout(() => {
            setIsAdding(false)
            setAddedSuccess(true)
            setTimeout(() => setAddedSuccess(false), 3000)
        }, 400)
    }

    return (
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-x-12">
            {/* Visual Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <Image
                        src={product.images[selectedImage] || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {/* Gallery Thumbnails */}
                {product.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                    selectedImage === idx ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Information & Purchasing Section */}
            <div className="flex flex-col space-y-6">
                <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">{product.category}</span>
                    <h1 className="mt-1 text-3xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
                    <p className="mt-2 text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

                <hr className="border-gray-200" />

                {/* Size Selection */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              Select Size {selectedSize && <span className="font-normal text-gray-500">({selectedSize})</span>}
            </span>
                        <button
                            onClick={() => setShowSizeChart(!showSizeChart)}
                            className="text-xs font-semibold text-gray-700 underline underline-offset-4 hover:text-black"
                        >
                            {showSizeChart ? 'Hide Size Guide' : 'Size Guide & Measurements'}
                        </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {product.sizeVariants.map(({ size, inStock }) => {
                            const isSelected = selectedSize === size
                            const isOutOfStock = inStock <= 0

                            return (
                                <button
                                    key={size}
                                    onClick={() => handleSizeSelect(size, inStock)}
                                    disabled={isOutOfStock}
                                    className={`relative flex flex-col items-center justify-center rounded-lg border py-3 text-sm font-semibold transition ${
                                        isSelected
                                            ? 'border-black bg-black text-white'
                                            : isOutOfStock
                                                ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                                : 'border-gray-300 bg-white text-gray-900 hover:border-black'
                                    }`}
                                >
                                    {size}
                                    {!isOutOfStock && inStock <= 3 && (
                                        <span className={`text-[9px] font-normal ${isSelected ? 'text-amber-200' : 'text-amber-600'}`}>
                      Only {inStock} left
                    </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Size Chart Toggle Drawer */}
                    {showSizeChart && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4 border border-gray-200 text-xs">
                            <h4 className="font-bold text-gray-900 mb-2">Size Measurements (Inches)</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="border-b border-gray-300 text-gray-600">
                                        <th className="py-1">Size</th>
                                        <th className="py-1">Bust</th>
                                        <th className="py-1">Waist</th>
                                        <th className="py-1">Hips</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {product.sizeChart.map((row) => (
                                        <tr key={row.size} className="border-b border-gray-200 text-gray-800">
                                            <td className="py-1.5 font-bold">{row.size}</td>
                                            <td className="py-1.5">{row.bustInches}</td>
                                            <td className="py-1.5">{row.waistInches}</td>
                                            <td className="py-1.5">{row.hipInches}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quantity Controls */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900">Quantity</label>
                    <div className="flex items-center gap-3 w-44">
                        <button
                            type="button"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1 || !selectedSize}
                            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 font-bold text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            -
                        </button>
                        <span className="flex-1 text-center font-bold text-lg text-gray-900">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => handleQuantityChange(1)}
                            disabled={!selectedSize || quantity >= maxAvailableStock}
                            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 font-bold text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Validation Errors */}
                {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

                {/* Total Cost Display */}
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-gray-500">Total Price</span>
                        <p className="text-xs text-gray-600 font-medium">
                            {quantity} unit(s) × ${product.price.toFixed(2)}
                        </p>
                    </div>
                    <span className="text-2xl font-extrabold text-gray-900">
            ${(product.price * quantity).toFixed(2)}
          </span>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || maxAvailableStock <= 0 || isAdding}
                    className={`w-full rounded-lg py-4 text-center font-bold text-white transition shadow-md ${
                        addedSuccess
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    }`}
                >
                    {isAdding
                        ? 'Adding to Bag...'
                        : addedSuccess
                            ? '✓ Added to Bag!'
                            : !selectedSize
                                ? 'Select a Size'
                                : 'Add to Bag'}
                </button>

                {/* Fit & Composition Accordion / List */}
                <div className="space-y-4 pt-4 border-t border-gray-200 text-xs">
                    <div>
                        <h4 className="font-bold text-gray-900">Fabric & Care</h4>
                        <p className="mt-1 text-gray-600">{product.fabricComposition}</p>
                        <ul className="mt-1.5 list-disc list-inside text-gray-600 space-y-0.5">
                            {product.careInstructions.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900">Fit & Sizing Note</h4>
                        <p className="mt-1 text-gray-600 leading-relaxed">{product.fitDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}