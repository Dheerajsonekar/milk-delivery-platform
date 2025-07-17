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
      const res = await api.get('/vendor/payouts') // Note: endpoint should be /vendor/payouts based on your route
      // Transform the response to match your frontend state
      const { pendingAmount, payouts } = res.data
      
      // Calculate totals from payouts array
      const paidOut = payouts
        .filter((payout: any) => payout.status === 'paid')
        .reduce((sum: number, payout: any) => sum + payout.amount, 0)
      
      const totalEarned = pendingAmount + paidOut

      setPaymentStats({
        totalEarned,
        pendingPayout: pendingAmount,
        paidOut
      })
    }
    fetchPayments()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-100 p-4 rounded">
          <p className="font-semibold">Total Earned</p>
          <p className="text-xl font-bold">₹{paymentStats.totalEarned}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded">
          <p className="font-semibold">Pending Payout</p>
          <p className="text-xl font-bold">₹{paymentStats.pendingPayout}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="font-semibold">Paid Out</p>
          <p className="text-xl font-bold">₹{paymentStats.paidOut}</p>
        </div>
      </div>
    </div>
  )
}