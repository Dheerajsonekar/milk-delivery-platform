'use client'
import React from 'react'

interface OrderCardProps {
  order: {
    _id: string
    totalAmount: number
    status: string
    createdAt: string
    products: {
      productId: {
        name: string
        price: number
      } | null
      quantity: number
    }[]
    cancelReason?: string
  }
  onCancel?: (orderId: string) => void
  showCancelButton?: boolean
}

export default function OrderCard({ order, onCancel, showCancelButton }: OrderCardProps) {
  // Filter out products with null productId
  const validProducts = order.products.filter(item => item.productId !== null)

  return (
    <div className="border rounded-md p-4 shadow-md hover:shadow-lg transition">
      <div>
        <h3 className="font-semibold text-lg text-green-700">Order #{order._id.slice(-5)}</h3>
        <p className="text-sm text-gray-600">Status: <span className="font-medium">{order.status}</span></p>
        {order.cancelReason && (
          <p className="text-xs text-red-500">Cancelled: {order.cancelReason}</p>
        )}
        <p className="text-sm text-gray-600 mb-2">Total: ₹{order.totalAmount}</p>
      </div>

      <ul className="text-sm pl-4 list-disc text-gray-700 mt-2">
        {validProducts.length > 0 ? (
          validProducts.map((item, index) => (
            <li key={index}>
              {item.productId!.name} × {item.quantity} = ₹{item.productId!.price * item.quantity}
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">No valid products in this order</li>
        )}
      </ul>
      <p className="text-xs text-gray-400 mt-2">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>

      {showCancelButton && order.status === 'pending' && (
        <button
          onClick={() => onCancel?.(order._id)}
          className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 mt-3"
        >
          Cancel
        </button>
      )}
    </div>
  )
}