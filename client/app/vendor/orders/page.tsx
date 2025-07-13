'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

interface Feedback {
  rating: number
  comment: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE']

export default function VendorOrdersPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/vendor/orders/stats')
        setStats(res.data)
      } catch (err) {
        console.error('Failed to load stats', err)
      }
    }

    fetchStats()
  }, [])

  if (!stats) return <div className="p-6">Loading vendor orders...</div>

  const cancelReasons = stats.cancelReasons ?? {}
  const cancelReasonsData = Object.entries(cancelReasons).map(([reason, count]) => ({
    name: reason,
    value: count as number
  }))

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Order Overview</h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Delivered</h2>
          <p className="text-2xl">{stats.ordersDelivered}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Cancelled</h2>
          <p className="text-2xl">{stats.totalCancelled}</p>
        </div>
      </div>

      {/* Cancel Reason Pie Chart */}
      <div className="bg-white shadow p-6 rounded max-w-md">
        <h3 className="text-xl font-bold mb-4">Cancel Reasons</h3>
        {cancelReasonsData.length > 0 ? (
          <PieChart width={300} height={250}>
            <Pie
              data={cancelReasonsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {cancelReasonsData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p className="text-gray-500 text-sm">No cancellation data available.</p>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-white shadow p-6 rounded">
        <h3 className="text-xl font-bold mb-4">Order Feedback</h3>
        {(!stats.feedbacks || stats.feedbacks.length === 0) ? (
          <p>No feedback yet.</p>
        ) : (
          <div className="space-y-4">
            {stats.feedbacks.map((fb: any, idx: number) => (
              <div key={idx} className="border rounded p-3">
                <p className="font-semibold">Rating: ⭐ {fb.feedback.rating}/5</p>
                {fb.feedback.comment && (
                  <p className="text-gray-600 mt-1">{fb.feedback.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
