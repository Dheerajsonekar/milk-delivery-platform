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
      }
      quantity: number
    }[]
  }
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h3 className="font-semibold text-lg">Order #{order._id.slice(-5)}</h3>
      <p className="text-sm text-gray-600">Status: <span className="font-medium">{order.status}</span></p>
      <p className="text-sm text-gray-600 mb-2">Total: ₹{order.totalAmount}</p>
      <ul className="text-sm pl-4 list-disc text-gray-700">
        {order.products.map((item, index) => (
          <li key={index}>
            {item.productId.name} x {item.quantity} – ₹{item.productId.price * item.quantity}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-400 mt-2">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
    </div>
  )
}
