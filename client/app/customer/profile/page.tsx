'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function CustomerProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile')
        setProfile(res.data)
      } catch (err: any) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (!profile) return <div className="p-4">No profile found.</div>

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4 text-green-700">My Profile</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Registered:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
