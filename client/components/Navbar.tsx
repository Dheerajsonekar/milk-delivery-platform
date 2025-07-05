'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/axios'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, setIsLoggedIn, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await api.post('/logout')
      setIsLoggedIn(false)
      router.push('/login')
    } catch (err) {
      alert('Logout failed')
    }
  }

  const navClass = (active: boolean) =>
    `text-sm font-medium hover:text-green-600 transition ${
      active ? 'text-green-700 underline' : 'text-gray-600'
    }`

  if (loading) return null // Wait for auth state to load

  return (
    <nav className="bg-white shadow-md py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold text-green-700">
          MilkApp
        </Link>

        {/* Right: Links */}
        <div className="space-x-4 flex items-center">
          <Link href="/" className={navClass(pathname === '/')}>Home</Link>
          <Link href="/vendor/dashboard" className={navClass(pathname.startsWith('/vendor'))}>Vendor</Link>
          <Link href="/customer/dashboard" className={navClass(pathname.startsWith('/customer'))}>Customer</Link>
          <Link href="/admin/register" className={navClass(pathname.startsWith('/admin'))}>Admin</Link>

          {/* ✅ Auth Actions */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm ml-4"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm text-blue-600 font-medium hover:underline ml-4">
                Login
              </Link>
              <Link href="/register" className="text-sm text-blue-600 font-medium hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
