'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import Link from 'next/link'

export default function AdminRegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'admin', 
    secretCode: '', 
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/register', form)
      if (res.status === 200 || res.status === 201) {
        router.push('/login')
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Admin registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Admin Registration</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Office Address"
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          name="secretCode"
          value={form.secretCode}
          onChange={handleChange}
          placeholder="Secret Admin Code"
          required
          className="w-full p-2 border mb-4 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
        >
          {loading ? 'Registering Admin...' : 'Register as Admin'}
        </button>

        <p className="text-sm text-center text-gray-600 mt-3">
          Not an Admin?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register as User
          </Link>
        </p>
      </form>
    </div>
  )
}
