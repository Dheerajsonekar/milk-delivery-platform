'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

interface Report {
  totalRevenue: number
  todayOrders: number
  newVendors: number
  newCustomers: number
  totalProfit: number
}

export default function AdminReportPage() {
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      const res = await axios.get('/admin/report')
      setReport(res.data)
    }
    fetchReport()
  }, [])

  if (!report) return <div className="p-6">Loading report...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Platform Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-xl font-bold text-green-600">₹{report.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-gray-500">Today’s Orders</h2>
          <p className="text-xl font-bold text-blue-600">{report.todayOrders}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-gray-500">New Vendors Today</h2>
          <p className="text-xl font-bold text-purple-600">{report.newVendors}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-gray-500">New Customers Today</h2>
          <p className="text-xl font-bold text-indigo-600">{report.newCustomers}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-gray-500">Total Profit</h2>
          <p className="text-xl font-bold text-rose-600">₹{report.totalProfit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
