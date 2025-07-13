'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

interface Subscription {
  _id: string
  vendorId: {
    _id: string
    name: string
    email: string
  }
  plan: string
  startDate: string
  endDate: string
  isActive: boolean
}

export default function AdminSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    const res = await axios.get('/admin/subscriptions')
    setSubscriptions(res.data)
  }

  const toggleStatus = async (id: string, isActive: boolean) => {
    await axios.patch(`/admin/subscriptions/${id}`, { isActive: !isActive })
    fetchSubscriptions()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendor Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Vendor</th>
              <th className="p-2">Plan</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Active</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-2">
                  {s.vendorId?.name} <br />
                  <span className="text-sm text-gray-500">{s.vendorId?.email}</span>
                </td>
                <td className="p-2 capitalize">{s.plan}</td>
                <td className="p-2">{new Date(s.startDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(s.endDate).toLocaleDateString()}</td>
                <td className="p-2">{s.isActive ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleStatus(s._id, s.isActive)}
                    className={`px-3 py-1 rounded text-white ${
                      s.isActive ? 'bg-red-500' : 'bg-green-600'
                    }`}
                  >
                    {s.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
