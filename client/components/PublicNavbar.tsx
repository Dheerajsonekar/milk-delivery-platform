'use client'

import Link from 'next/link'

export default function PublicNavbar() {
  return (
    <nav className="bg-yellow-100 text-gray-800 px-6 py-3 flex justify-between items-center shadow">
      <Link href="/" className="text-xl font-bold text-green-700">
        FreshMilk
      </Link>
      <div className="flex gap-4 items-center">
        
        <Link href="/login">
          <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition">
            Login/Register
          </button>
        </Link>
      </div>
    </nav>
  )
}
