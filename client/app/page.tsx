'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import ProductCard from '@/components/ProductCard'
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products')
        setProducts(res.data)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }

    fetchProducts()
  }, [])

  const handleOrder = (product: any) => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push('/login')
      } else {
        alert(`Placing order for: ${product.name}`)
        // Replace with real order logic
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-8">
      {/* Only show product grid once auth is resolved */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLoggedIn ? 'Available Products' : 'FreshMilk Products'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              showOrderButton
              onOrder={() => handleOrder(product)}
            />
          ))}
        </div>

        {/* {!isLoggedIn && (
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">To order, please login or register.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Register
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
