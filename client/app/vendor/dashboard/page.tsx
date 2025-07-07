'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function VendorDashboard() {
  const [orders, setOrders] = useState<any[]>([])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/vendor')
      setOrders(res.data)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
    }
  }

  const handleMarkAsDone = async (orderId: string) => {
    try {
      await api.patch('/orders/status', {
        orderId,
        status: 'delivered', // ✅ Pass status in body as per your updated controller
      })
      fetchOrders() // Refresh orders
    } catch (err) {
      alert('Failed to update order status.')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-green-700">Vendor Dashboard - My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <ul className="ml-4 mt-2 text-sm">
                {order.products.map((item: any) => (
                  <li key={item.productId._id}>
                    {item.productId.name} - {item.quantity}
                  </li>
                ))}
              </ul>

              {order.status !== 'delivered' && (
                <button
                  onClick={() => handleMarkAsDone(order._id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Mark as Done
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
