'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

interface AdminProfile {
  name: string
  email: string
  role: string
  address: string
  createdAt: string
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get('/admin/profile')
      setProfile(res.data)
    }
    fetchProfile()
  }, [])

  if (!profile) return <div className="p-6">Loading profile...</div>

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

      <div className="bg-white shadow p-4 rounded space-y-4">
        <div>
          <h2 className="text-gray-500">Name</h2>
          <p className="font-medium">{profile.name}</p>
        </div>
        <div>
          <h2 className="text-gray-500">Email</h2>
          <p className="font-medium">{profile.email}</p>
        </div>
        <div>
          <h2 className="text-gray-500">Role</h2>
          <p className="font-medium capitalize">{profile.role}</p>
        </div>
        <div>
          <h2 className="text-gray-500">Address</h2>
          <p className="font-medium">{profile.address}</p>
        </div>
        <div>
          <h2 className="text-gray-500">Joined</h2>
          <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
