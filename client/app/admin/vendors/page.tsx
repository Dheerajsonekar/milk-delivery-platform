'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

interface Vendor {
  _id: string
  name: string
  email: string
  address: string
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get('/admin/vendors')
        setVendors(res.data)
      } catch (err) {
        console.error('Failed to fetch vendors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  if (loading) return <div className="p-6">Loading vendors...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Vendors</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-t">
                <td className="px-4 py-2">{vendor.name}</td>
                <td className="px-4 py-2">{vendor.email}</td>
                <td className="px-4 py-2">{vendor.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
