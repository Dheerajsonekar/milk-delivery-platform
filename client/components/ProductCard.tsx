'use client'
import React from 'react'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    price: number
    unit: string
    description: string
    vendorName?: string
  }
  showOrderButton?: boolean
  onOrder?: () => void
}

export default function ProductCard({ product, showOrderButton, onOrder }: ProductCardProps) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
      <p className="mt-2 font-medium">₹{product.price} / {product.unit}</p>
      {product.vendorName && (
        <p className="text-xs mt-1 text-gray-500">by {product.vendorName}</p>
      )}
      {showOrderButton && (
        <button
          onClick={onOrder}
          className="bg-green-600 text-white mt-4 px-4 py-2 rounded hover:bg-green-700"
        >
          Order Now
        </button>
      )}
    </div>
  )
}
