'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE']

export default function VendorReportsPage() {
  const [report, setReport] = useState<any>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('/vendor/reports/summary')
        setReport(res.data)
      } catch (err) {
        console.error('Failed to fetch report', err)
      }
    }

    fetchReport()
  }, [])

  if (!report) return <div className="p-6">Loading report...</div>

  const customerPieData = [
    { name: 'New', value: report.newCustomers },
    { name: 'Loyal', value: report.loyalCustomers },
  ]

  const isTrendValidArray = Array.isArray(report.orderTrends)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Vendor Report Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Revenue" value={`₹ ${report.totalRevenue}`} />
        <Card title="Today’s Revenue" value={`₹ ${report.todaysRevenue}`} />
        <Card title="Total Orders" value={report.totalOrders} />
        <Card title="Total Customers" value={report.totalCustomers} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Types Pie Chart */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Customer Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={customerPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {customerPieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Order Trends Bar Chart */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Orders Trend</h3>
          {isTrendValidArray ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={report.orderTrends}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No order trend data available.</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Sold</th>
                <th className="p-2">Stock Left</th>
              </tr>
            </thead>
            <tbody>
              {report.topProducts?.length > 0 ? (
                report.topProducts.map((prod: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{prod.name}</td>
                    <td className="p-2">{prod.sold}</td>
                    <td className="p-2">{prod.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-2 text-center text-gray-500">
                    No product data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white p-4 shadow rounded text-center">
      <h2 className="text-md font-medium mb-1">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
