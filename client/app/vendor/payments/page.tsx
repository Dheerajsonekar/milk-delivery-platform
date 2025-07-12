'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function VendorPayments() {
  const [paymentStats, setPaymentStats] = useState({
    totalEarned: 0,
    pendingPayout: 0,
    paidOut: 0,
  })

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await api.get('/vendor/payment-summary')
      setPaymentStats(res.data)
    }
    fetchPayments()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-100 p-4 rounded">
          <p className="font-semibold">Total Earned</p>
          <p className="text-xl font-bold">₹{paymentStats.pendingAmount}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded">
          <p className="font-semibold">Pending Payout</p>
          <p className="text-xl font-bold">₹{paymentStats.pendingAmount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="font-semibold">Paid Out</p>
          <p className="text-xl font-bold">₹{paymentStats.paidAmount}</p>
        </div>
      </div>
    </div>
  )
}
