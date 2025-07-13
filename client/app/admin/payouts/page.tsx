'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

interface Payout {
  id: number
  vendorId: string
  amount: number
  status: 'requested' | 'paid' | 'rejected'
  createdAt: string
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])

  useEffect(() => {
    fetchPayouts()
  }, [])

  const fetchPayouts = async () => {
    const res = await axios.get('/admin/payouts')
    setPayouts(res.data)
  }

  const updateStatus = async (id: number, status: 'paid' | 'rejected') => {
    await axios.patch(`/admin/payouts/${id}`, { status })
    fetchPayouts()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendor Payout Requests</h1>
      {payouts.length === 0 ? (
        <p>No payout requests</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Vendor ID</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-t">
                <td className="p-2">{payout.id}</td>
                <td className="p-2">{payout.vendorId}</td>
                <td className="p-2">₹{payout.amount}</td>
                <td className="p-2 capitalize">{payout.status}</td>
                <td className="p-2">{new Date(payout.createdAt).toLocaleDateString()}</td>
                <td className="p-2 space-x-2">
                  {payout.status === 'requested' && (
                    <>
                      <button
                        onClick={() => updateStatus(payout.id, 'paid')}
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => updateStatus(payout.id, 'rejected')}
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
