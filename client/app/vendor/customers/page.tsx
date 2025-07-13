'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'



export default function VendorCustomerPage(){
    const [stats, setStats] = useState<any>(null)

    useEffect(()=>{
        const fetchData = async () => {
            const res = await axios.get('/vendor/customers')
            setStats(res.data)
        }
        fetchData()
    }, [])

    if(!stats)  return <div>Loading...</div>

    return (
        <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">My Customers</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-600">New Customers</p>
          <p className="text-2xl font-bold">{stats.newCustomers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-600">Loyal Customers</p>
          <p className="text-2xl font-bold">{stats.loyalCustomers.length}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">Loyal Customer Details</h3>
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Total Orders</th>
              <th className="px-4 py-2">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {stats.loyalCustomers.map((cust: any) => (
              <tr key={cust._id} className="border-t">
                <td className="px-4 py-2">{cust.name}</td>
                <td className="px-4 py-2">{cust.email}</td>
                <td className="px-4 py-2">{cust.totalOrders}</td>
                <td className="px-4 py-2">{new Date(cust.lastOrderDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
}