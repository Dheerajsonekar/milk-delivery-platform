'use client'

import Link from 'next/link'
import { useHandleLogout } from '@/lib/handleLogout'

export default function VendorNavbar() {
  const logout = useHandleLogout()

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link href="/vendor/dashboard" className="text-xl font-bold">
        FreshMilk Vendor
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/vendor/dashboard">Dashboard</Link>
        <Link href="/vendor/products">Products</Link>
        <Link href="/vendor/orders"> Orders</Link>
        <Link href="/vendor/payments">Payment</Link>
        <Link href="/vendor/profile">Profile</Link>
        <button
          onClick={logout}
          className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
