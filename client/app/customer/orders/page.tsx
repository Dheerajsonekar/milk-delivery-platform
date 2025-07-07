'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function MyOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get('/orders/customer')
      setOrders(res.data)
    }
    fetchOrders()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order: any) => (
          <div key={order._id} className="border rounded p-4 shadow mb-4">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
            <div className="mt-2">
              <h4 className="font-semibold">Products:</h4>
              <ul className="list-disc ml-6">
                {order.products.map((p: any, index: number) => (
                  <li key={index}>
                    {p.productId?.name} – {p.quantity} units
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
