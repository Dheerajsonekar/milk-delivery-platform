'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { format } from 'date-fns'
import classNames from 'classnames'

export default function VendorPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [pendingAmount, setPendingAmount] = useState(0)
  const [bankDetails, setBankDetails] = useState<any>(null)

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await axios.get('/vendor/payouts')
        setPayouts(res.data.payouts || [])
        setPendingAmount(res.data.pendingAmount || 0)
        setBankDetails(res.data.bankDetails || null)
      } catch (err) {
        console.error('Error fetching payouts', err)
      }
    }

    fetchPayouts()
  }, [])

  const handleRequestPayout = async () => {
    try {
      const res = await axios.post('/vendor/payouts/request')
      alert(res.data.message || 'Payout requested')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request payout')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Vendor Payouts</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Pending Payout</h2>
          <p className="text-2xl font-bold text-green-600">₹{pendingAmount}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Payouts</h2>
          <p className="text-2xl font-bold">{payouts.length}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Bank Account</h2>
          <p className="text-sm text-gray-800">
            {bankDetails ? `${bankDetails.bankName} ••••${bankDetails.accountNumber?.slice(-4)}` : 'Not Set'}
          </p>
        </div>
      </div>

      {/* Request Payout Button */}
      <div>
        <button
          onClick={handleRequestPayout}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Request Payout
        </button>
      </div>

      {/* Payout History Table */}
      <div className="bg-white shadow rounded p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Payout History</h2>
        {payouts.length === 0 ? (
          <p className="text-gray-500">No payouts yet.</p>
        ) : (
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Date</th>
                <th className="p-2">Amount (₹)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Bank</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{format(new Date(payout.createdAt), 'dd MMM yyyy')}</td>
                  <td className="p-2 font-medium">₹{payout.amount}</td>
                  <td className="p-2">
                    <span
                      className={classNames(
                        'px-2 py-1 rounded text-xs font-medium',
                        {
                          'bg-yellow-100 text-yellow-700': payout.status === 'requested',
                          'bg-green-100 text-green-700': payout.status === 'paid',
                          'bg-red-100 text-red-700': payout.status === 'rejected',
                        }
                      )}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="p-2">{payout.bankDetails?.bankName || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
