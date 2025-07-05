'use client'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await api.post('/logout')
      router.push('/login')
    } catch (err) {
      alert('Logout failed')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  )
}
