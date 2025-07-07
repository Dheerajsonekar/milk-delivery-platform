'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function VendorProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile')
        setProfile(res.data)
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (!profile) return <div className="p-4">Profile not found</div>

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Vendor Profile</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Registered on:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>

      {profile.subscription && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Subscription Details</h3>
          <div className="space-y-1 text-gray-800">
            <p><strong>Plan:</strong> {profile.subscription.plan}</p>
            <p><strong>Status:</strong> {profile.subscription.status}</p>
            <p><strong>Expires On:</strong> {new Date(profile.subscription.expiresAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
