'use client'

import { useEffect, useState} from 'react'
import axios from '@/lib/axios'

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/vendor/dashboard')
        setStats(res.data)
      }catch(error){
        console.error('Failed to fetch vendor dashboard data: ', error)
      }
    }
    fetchData()
  }, [])

  if(!stats ) return <div>Loading dashboard...</div>

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