'use client'

import Link from 'next/link'
import { useHandleLogout } from '@/lib/handleLogout'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CustomerNavbar() {
  const logout = useHandleLogout()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }

    updateCart()
    window.addEventListener('storage', updateCart)
    return () => window.removeEventListener('storage', updateCart)
  }, [])

  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link href="/customer/products" className="text-xl font-bold">
        FreshMilk
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/customer/products">Products</Link>
        <Link href="/customer/orders">My Orders</Link>
        <Link href="/customer/profile">Profile</Link>

        {/* Cart Icon */}
        <Link href="/customer/cart" className="relative">
          <ShoppingCart className="w-6 h-6 text-white hover:text-gray-200" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

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
