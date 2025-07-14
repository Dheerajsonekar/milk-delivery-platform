'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/axios'
import {useAuth} from "@/context/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const {setIsLoggedIn} = useAuth();
  const { refreshAuth } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/login', form)

      if (res.status === 200) {
        
        const role = res.data.user?.role || 'customer'

        setIsLoggedIn(true);
         refreshAuth();

        if (role === 'vendor') {
          router.push('/vendor/dashboard')
        }else if(role === 'admin'){
          router.push('/admin/dashboard')
        }
        else {
          router.push('/customer/products')
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>

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
          className="w-full p-2 border mb-4 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded mb-3 hover:bg-green-700 transition"
          
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </p>
        
      </form>
    </div>
  )
}
