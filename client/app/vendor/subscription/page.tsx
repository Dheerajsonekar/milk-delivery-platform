'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

export default function VendorSubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axios.get('/vendor/subscription')
        setSubscription(res.data)
      } catch (err) {
        console.error('Failed to fetch subscription')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) return <div className="p-6">Loading subscription...</div>

  if (!subscription) {
    return (
      <div className="p-6 text-black-600">
        No active subscription found. Please contact support to subscribe.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold">My Subscription</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Plan:</p>
          <p className="font-semibold">{subscription.plan}</p>
        </div>
        <div>
          <p className="text-gray-600">Payment Status:</p>
          <p className={`font-semibold ${subscription.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
            {subscription.paymentStatus}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Start Date:</p>
          <p>{new Date(subscription.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-600">End Date:</p>
          <p>{new Date(subscription.endDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Status:</p>
          <p className={`font-semibold ${subscription.isActive ? 'text-green-600' : 'text-red-500'}`}>
            {subscription.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      
    </div>
  )
}
