'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function VendorDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [summary, setSummary] = useState({ pending: 0, paid: 0 })
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, paymentRes] = await Promise.all([
          api.get('/orders/vendor'),
          api.get('/vendor/payment-summary'),
        ])
        setOrders(orderRes.data)
        setSummary(paymentRes.data)
      } catch (err: any) {
        alert('Error fetching dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRequestPayout = async () => {
    try {
      setRequesting(true)
      await api.post('/vendor/request-payout')
      alert('Payout request submitted!')
    } catch (err: any) {
      alert('Failed to request payout')
    } finally {
      setRequesting(false)
    }
  }

  const pendingOrders = orders.filter(order => order.status === 'pending')
  
  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6"> Dashboard</h1>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Pending Balance</h3>
          <p className="text-xl mt-2 font-bold text-yellow-700">₹{summary.pendingAmount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Paid Balance</h3>
          <p className="text-xl mt-2 font-bold text-green-700">₹{summary.paidAmount}</p>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleRequestPayout}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={summary.pending === 0 || requesting}
          >
            {requesting ? 'Requesting...' : 'Request Payout'}
          </button>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p className="text-gray-600">No pending orders.</p>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map(order => (
              <div key={order._id} className="border p-4 rounded shadow">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
                <p>
                  <strong>Items:</strong>{' '}
                  {order.products
                    .map(p => p?.productId?.name || 'Unknown')
                    .join(', ')}
                </p>

              </div>
            ))}
          </div>
        )}
      </div>

      
      
    </div>
  )
}
