'use client'

import Link from 'next/link'
import { useHandleLogout } from '@/lib/handleLogout'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/context/cart-context'

export default function CustomerNavbar() {
  const logout = useHandleLogout()


  const { cart } = useCart()
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)



  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link href="/customer/products" className="text-xl font-bold">
        FreshMilk
      </Link>

      <div className="flex gap-6 items-center">
        


        {/* Cart Icon */}
        <Link href="/customer/cart" className="relative">
          <ShoppingCart className="w-6 h-6" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </Link>
        <Link href="/customer/products">Products</Link>
        <Link href="/customer/orders">Orders</Link>
        <Link href="/customer/profile">Profile</Link>

        <button
          onClick={logout}
          className="bg-white text-green-600 px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
