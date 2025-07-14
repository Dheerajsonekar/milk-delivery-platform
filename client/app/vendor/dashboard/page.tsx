'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/vendor/dashboard')
        setStats(res.data)
      } catch (error) {
        console.error('Failed to fetch vendor dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const markAsDelivered = async (orderId: string) => {
    try {
      setUpdatingId(orderId)
      await axios.patch(`/vendor/${orderId}/mark-delivered`)
      const updated = { ...stats }
      updated.pendingOrders = updated.pendingOrders.filter((o: any) => o._id !== orderId)
      updated.pendingOrdersToday = updated.pendingOrders.length
      setStats(updated)
    } catch (error) {
      console.error('Failed to mark order as delivered', error)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading || !stats) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Vendor Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Pending Orders Today" value={stats.pendingOrdersToday} />
        <Card title="Total Earnings" value={`₹${stats.totalEarnings}`} />
        <Card title="Pending Payout" value={`₹${stats.pendingPayout}`} />
        <Card title="Loyal Customers" value={stats.loyalCustomers} />
      </div>

      {/* Pending Orders List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>

        {Array.isArray(stats.pendingOrders) && stats.pendingOrders.length > 0 ? (
          <ul className="space-y-4">
            {stats.pendingOrders.map((order: any) => (
              <li
                key={order._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Customer:</strong> {order.customerId?.email || 'Unknown'}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                </div>
                <button
                  onClick={() => markAsDelivered(order._id)}
                  disabled={updatingId === order._id}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {updatingId === order._id ? 'Marking...' : 'Mark as Delivered'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No pending orders today.</p>
        )}

      </div>


      {/* Low Stock Warning */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Low Stock Alerts</h2>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500">All stocks are healthy ✅</p>
        ) : (
          <ul className="list-disc list-inside text-sm text-red-600">
            {stats.lowStockProducts.map((p: any) => (
              <li key={p._id}>{p.name} – {p.quantity} {p.unit}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white shadow p-4 rounded text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-green-700">{value}</p>
    </div>
  )
}
