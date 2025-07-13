'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'


export default function AdminDashboardPage() {

  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/admin/stats')
      setStats(res.data)
    }
    fetchStats()
  }, [])

  if (!stats) return <p className="p-6">Loading dashboard...</p>


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold text-gray-700">Total Vendors</h2>
        <p className="text-3xl mt-2 text-green-700">{stats.totalVendors}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold text-gray-700">Total Customers</h2>
        <p className="text-3xl mt-2 text-green-700">{stats.totalCustomers}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold text-gray-700">Total Orders</h2>
        <p className="text-3xl mt-2 text-green-700">{stats.totalOrders}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold text-gray-700">Total Products</h2>
        <p className="text-3xl mt-2 text-green-700">{stats.totalProducts}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold text-gray-700">Pending Payouts</h2>
        <p className="text-3xl mt-2 text-red-600">₹ {stats.pendingPayoutAmount}</p>
      </div>
    </div>
  )
}
