'use client'
import React, { useState } from 'react'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    price: number
    unit: string
    description: string
    vendorId: string  // ✅ Required
    vendorName?: string
  }
  showOrderButton?: boolean
  onOrder?: () => void
}

export default function ProductCard({ product, showOrderButton, onOrder }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    const newItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      vendorId: product.vendorId,
    }

    cart.push(newItem)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
      <p className="mt-2 font-medium">₹{product.price} / {product.unit}</p>

      {product.vendorName && (
        <p className="text-xs mt-1 text-gray-500">by {product.vendorName}</p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <input
          type="number"
          value={quantity}
          min={1}
          className="w-16 px-2 py-1 border"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        {showOrderButton && (
          <button
            onClick={onOrder}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Order Now
          </button>
        )}
        <button
          onClick={handleAddToCart}
          className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
