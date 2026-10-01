'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FabricDetail } from './page'

interface FabricDetailClientProps {
    fabric: FabricDetail
}

export default function FabricDetailClient({ fabric }: FabricDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [meters, setMeters] = useState<number>(1.0)
    const [inputError, setInputError] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [addedSuccess, setAddedSuccess] = useState(false)

    // Calculate live pricing
    const totalCost = (meters * fabric.pricePerMeter).toFixed(2)

    // Step controls (+/- by 0.5 meters)
    const handleStepMeters = (delta: number) => {
        const newMeters = Math.round((meters + delta) * 100) / 100
        validateAndSetMeters(newMeters)
    }

    // Direct input handling
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value)
        if (isNaN(val)) {
            setMeters(0)
            setInputError(`Minimum length is ${fabric.minMeters}m`)
            return
        }
        validateAndSetMeters(val)
    }

    const validateAndSetMeters = (val: number) => {
        setInputError(null)

        if (val < fabric.minMeters) {
            setInputError(`Minimum cut is ${fabric.minMeters} meter(s)`)
        } else if (val > fabric.inStockMeters) {
            setInputError(`Only ${fabric.inStockMeters}m currently available in stock`)
        } else if (val > fabric.maxMetersPerOrder) {
            setInputError(`Maximum ${fabric.maxMetersPerOrder}m allowed per order`)
        }

        setMeters(val)
    }

    const handleAddToCart = () => {
        if (meters < fabric.minMeters || meters > fabric.inStockMeters) return

        setIsAdding(true)

        // Construct uniform cart payload
        const cartItem = {
            id: fabric.id,
            type: 'FABRIC' as const,
            fabricId: fabric.id,
            name: fabric.name,
            price: fabric.pricePerMeter,
            quantity: meters, // Quantity represents length in meters for fabrics
            unitLabel: 'meter',
            image: fabric.images[0],
            totalPrice: parseFloat(totalCost),
        }

        console.log('Adding fabric to cart:', cartItem)

        // Simulate cart store dispatch
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
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <Image
                        src={fabric.images[selectedImage] || '/images/placeholder.jpg'}
                        alt={fabric.name}
                        fill
                        priority
                        className="object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {fabric.material}
          </span>
                </div>

                {/* Thumbnail Selector */}
                {fabric.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {fabric.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                    selectedImage === idx ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Technical Specs Summary Box */}
                <div className="mt-6 rounded-lg bg-gray-50 p-5 border border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Technical Specifications</h3>
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div>
                            <dt className="text-gray-500">Composition</dt>
                            <dd className="font-semibold text-gray-900">{fabric.composition}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Fabric Width</dt>
                            <dd className="font-semibold text-gray-900">{fabric.widthInches}&quot; ({Math.round(fabric.widthInches * 2.54)} cm)</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Weight</dt>
                            <dd className="font-semibold text-gray-900">{fabric.weightGsm} GSM</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Stock Available</dt>
                            <dd className="font-semibold text-emerald-600">{fabric.inStockMeters} Meters continuous</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Purchasing & Calculation Panel */}
            <div className="flex flex-col space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{fabric.name}</h1>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">${fabric.pricePerMeter.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">/ meter</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{fabric.description}</p>

                <hr className="border-gray-200" />

                {/* Dynamic Meter Selection Area */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="meters" className="text-sm font-bold text-gray-900">
                            Select Length (Meters)
                        </label>
                        <span className="text-xs text-gray-500">Min. cut: {fabric.minMeters}m</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Decrement Button */}
                        <button
                            type="button"
                            onClick={() => handleStepMeters(-0.5)}
                            disabled={meters <= fabric.minMeters}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 font-bold text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            -
                        </button>

                        {/* Direct Number Input */}
                        <div className="relative flex-1">
                            <input
                                id="meters"
                                type="number"
                                step="0.1"
                                min={fabric.minMeters}
                                max={fabric.inStockMeters}
                                value={meters || ''}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-center text-lg font-bold text-gray-900 focus:border-black focus:ring-black"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                meters
              </span>
                        </div>

                        {/* Increment Button */}
                        <button
                            type="button"
                            onClick={() => handleStepMeters(0.5)}
                            disabled={meters >= fabric.inStockMeters}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 font-bold text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            +
                        </button>
                    </div>

                    {/* Preset Meter Quick Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-gray-500 mr-1">Quick select:</span>
                        {[1, 2, 2.5, 3, 5].map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => validateAndSetMeters(preset)}
                                className={`rounded border px-2.5 py-1 text-xs font-medium transition ${
                                    meters === preset
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                                }`}
                            >
                                {preset}m
                            </button>
                        ))}
                    </div>

                    {/* Validation Message */}
                    {inputError && <p className="text-xs font-semibold text-red-600">{inputError}</p>}

                    {/* Dynamic Total Price Display */}
                    <div className="mt-4 border-t border-gray-100 pt-4 flex items-center justify-between bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                        <div>
                            <p className="text-xs text-gray-500">Total Calculation</p>
                            <p className="text-xs text-gray-600 font-medium">
                                {meters > 0 ? `${meters}m × $${fabric.pricePerMeter.toFixed(2)}/m` : 'Enter length'}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-extrabold text-gray-900">${totalCost}</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={Boolean(inputError) || isAdding || meters < fabric.minMeters}
                    className={`w-full rounded-lg py-4 text-center font-bold text-white transition shadow-md ${
                        addedSuccess
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    }`}
                >
                    {isAdding ? 'Adding to Cart...' : addedSuccess ? '✓ Added to Cart!' : `Add ${meters} Meter(s) to Order`}
                </button>

                {/* Recommended Uses & Care Instructions */}
                <div className="space-y-4 pt-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">Recommended For</h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {fabric.recommendedUses.map((use) => (
                                <span key={use} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700 font-medium">
                  {use}
                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">Care Guide</h4>
                        <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside">
                            {fabric.careInstructions.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}