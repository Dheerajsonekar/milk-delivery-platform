'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import OrderCard from '@/components/OrderCard'

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/customer')
      setOrders(res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (err) {
      console.error('Failed to fetch orders', err)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const cancelOrder = async (orderId: string) => {
    const reason = prompt('Why are you cancelling this order?')
    if (!reason) return
    try {
      await api.patch(`/orders/${orderId}/cancel`, { reason })
      alert('Order cancelled successfully.')
      fetchOrders()
    } catch (err) {
      console.error('Failed to cancel order', err)
      alert('Could not cancel the order.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6 space-y-4">
      <h2 className="text-center text-2xl font-bold mb-4 text-green-700">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders placed yet.</p>
      ) : (
        orders.map(order => (
          <OrderCard key={order._id} order={order} showCancelButton onCancel={cancelOrder} />
        ))
      )}
    </div>
  )
}
