'use client'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

export default function DeliveryBoyDahsboard() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    axios.get('/deliveryboy/orders').then(res => setOrders(res.data))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await axios.patch(`/deliveryboy/order/${id}/status`, { status })
    setOrders(orders.map(o => o._id === id ? { ...o, deliveryStatus: status } : o))
  }

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold">My Delivery Orders</h1>
      <ul className="space-y-4 mt-4">
        {orders.map(order => (
          <li key={order._id} className="border p-4 rounded">
            <p><strong>Customer:</strong> {order.customerId.email}</p>
            <p><strong>Vendor:</strong> {order.vendorId.email}</p>
            <p><strong>Status:</strong> {order.deliveryStatus}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateStatus(order._id, 'picked')} className="px-3 py-1 bg-yellow-500 text-white rounded">Picked</button>
              <button onClick={() => updateStatus(order._id, 'out-for-delivery')} className="px-3 py-1 bg-blue-500 text-white rounded">Out</button>
              <button onClick={() => updateStatus(order._id, 'delivered')} className="px-3 py-1 bg-green-600 text-white rounded">Delivered</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
