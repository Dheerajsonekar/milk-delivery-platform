'use client'

import Link from 'next/link'
import { useHandleLogout } from '@/lib/handleLogout'

export default function AdminNavbar() {
  const logout = useHandleLogout()

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link href="/admin/dashboard" className="text-xl font-bold">
        Admin Panel
      </Link>
      <div className="flex gap-6 items-center">
        
        
        
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/vendors">Vendors</Link>
        <Link href="/admin/customers">Customers</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/subscriptions">Subscriptions</Link>

        <button
          onClick={logout}
          className="bg-white text-gray-800 px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
