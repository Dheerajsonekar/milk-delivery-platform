'use client'

import Link from 'next/link'
import { useHandleLogout } from '@/lib/handleLogout'

export default function DeliveryBoyNavbar() {
  const logout = useHandleLogout()

  return (
    <nav className="bg-slate-800 text-slate-100 px-6 py-3 flex justify-between items-center shadow-md">
      <Link href="/deliveryBoy/dashboard" className="text-xl font-bold tracking-wide">
        🚴 FreshMilk Delivery
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/deliveryBoy/profile" className="hover:underline">Profile</Link>

        <button
          onClick={logout}
          className="bg-white text-slate-800 px-4 py-1 rounded hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
